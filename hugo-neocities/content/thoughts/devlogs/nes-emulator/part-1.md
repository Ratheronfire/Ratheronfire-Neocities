---
title: "Let's Make an NES Emulator! - Part 1: The Story So Far"
description: "I've been working on a basic NES emulator in Godot for a while now and decided to start keeping a log of my progress."
thumbnail: "/img/thoughts/devlogs/nes-emulator/part-1/emulator.png"
date: 2025-06-21T17:19:48.408Z
preview: ""
draft: false
tags:
    - devlog
    - gaming
    - nes-eumlator
categories:
    - blog
---

## Intro

A few years back I started toying with the idea of making an NES emulator in Godot. Since then I've stepped in every once in a while to poke at it and move it along a bit more. At the moment it doesn't have input or output, so instead the program window just shows a readout of the system memory and registers. Now I'm admittedly far from an expert at these things, so I imagine a lot of my implementation is horribly wrong, but I've been learning a lot throughout the process. I've been using the resources at [nesdev.org](https://www.nesdev.org/) to understand more about the original hardware and generally trying to shape my program to mimic their descriptions of how it all works, as well as a handful of other bits of reference material. If you want to see my code, it's available [on Github](https://github.com/Ratheronfire/NESGodot).

Here's what it looks like so far:

{{< figure
    src="/img/thoughts/devlogs/nes-emulator/part-1/emulator.png"
    class="center"
    alt="The emulator in action. No video output, but you can see some values written to memory.">}}

It works! ...Sort of, I think? Hard to say, really, I'm not far enough along to get any meaningful feedback one way or the other. Using Donkey Kong as a test ROM it seems like it's getting through the initialization, the endless loop waiting for the end of each frame, and the NMI function, but that's about it, and there's almost certainly a lot of necessary hardware interactions along the way that aren't being emulated currently.

Anyways, let's start with a breakdown of what I've gotten done so far:

## Assembly Parser

The first thing I did was write a parser which converted assembly code into bytecode. The parser takes into account the addressing modes of each opcode, keeping track of the cumulative number of bytes each line converts into, replaces labels with their relative byte indices, then finally looks up the byte values for each opcode and staples together the bytecode for each line.

```gdscript
func compile_script(script: String) -> PackedByteArray:
	var bytecode = PackedByteArray()
	var labels = {}
	
	var lines = []
	
	# Trimming excess whitespace
	for line in script.split("\n"):
		var trimmed_line = line.strip_edges().split(";")[0]
		
		if trimmed_line != "":
			lines.append(trimmed_line)
	
	# Pre-scanning the script for labels, making note of their byte offsets
	var bytes_so_far = 0
	for line in lines:
		var operands = line.split(" ")
		
		if len(operands) == 1:
			if ":" in operands[0]:
				# This is a new label
				var label = operands[0].replace(":", "")
				labels[label] = bytes_so_far
			else:
				bytes_so_far += Consts.BYTES_PER_MODE[Consts.AddressingModes.Implied]
		else:
			var context = Opcodes.determine_addressing_context(operands[0], operands[1])
			bytes_so_far += Consts.BYTES_PER_MODE[context.address_mode]
	
	# Replacing the labels with their newly calculated addresses
	bytes_so_far = 0
	for i in range(len(lines)):
		var line = lines[i]
		
		var operands = line.split(" ")
		if len(operands) == 1:
			if not ":" in operands[0]:
				bytes_so_far += Consts.BYTES_PER_MODE[Consts.AddressingModes.Implied]
		elif len(operands) > 1:
			var is_branch = operands[0] in ["BCC", "BCS", "BNE", "BEQ", "BPL", "BMI", "BVC", "BVS"]
			
			var context = Opcodes.determine_addressing_context(operands[0], operands[1])
			bytes_so_far += Consts.BYTES_PER_MODE[context.address_mode]
			
			for label in labels:
				if is_branch:
					operands[1] = operands[1].replace(label, str(labels[label] - bytes_so_far))
				else:
					operands[1] = operands[1].replace(label, str(Consts.CARTRIDGE_ADDRESS + labels[label]))
			
			lines[i] = operands[0] + " " + operands[1]
	
	# Parsing the script into bytecode line by line
	for line in lines:
		var operands = line.split(" ")
		
		if len(operands) == 1 and not ":" in operands[0]:
			bytecode.append(Consts.get_opcode(line, Consts.AddressingModes.Implied))
		elif len(operands) > 1:
			var is_branch = operands[0] in ["BCC", "BCS", "BNE", "BEQ", "BPL", "BMI", "BVC", "BVS"]
			
			var context = Opcodes.determine_addressing_context(operands[0], operands[1])
			if is_branch:
				context.address_mode = Consts.AddressingModes.Relative
			
			bytecode.append(Consts.get_opcode(operands[0], context.address_mode))
			
			var data_byte_count = Consts.BYTES_PER_MODE[context.address_mode]
			if data_byte_count >= 2:
				bytecode.append(context.value & 0xFF)
			if data_byte_count >= 3:
				bytecode.append(context.value >> 8)
	
	bytecode.append(0xFF)
	return bytecode
```

This turns my example assembly code into the following bytecode:

```asm
	LDX #0 ;Comments should be ignored. | A2 00
	LDA #0                              | A9 00
loop1:                                  | 
	STA 0,X                             | 95 00
	CLC                                 | 18
	ADC #1                              | 69 01
	INX                                 | E8
	CPX #$00                            | E0 00
	BEQ end                             | F0 03
	JMP loop1                           | 4C 04 80
end:                                    | 
	NOP                                 | EA
	JMP end                             | 4C 11 80
                                        | FF
```

Then that bytecode is inserted into the virtual NES RAM at address 0x8000, the program counter is updated, and execution can start.

Of course, that also means having to implement all the opcodes. There's a bit too much logic in the opcode script to explain it all here, but if you want to take a deep dive it's all in [Opcodes.gd](https://github.com/Ratheronfire/NESGodot/blob/main/src/globals/Opcodes.gd).

Now that the converted script is in RAM we can run it, which looks like this:

{{< figure
    src="/img/thoughts/devlogs/nes-emulator/part-1/script_output.gif"
    class="center"
    alt="My script from above running in the emulator, which fills the first page of RAM with values increasing from 00 to FF.">}}

Next, it's time to start working with actual ROMs, which means...

## Mappers

...Descending into the next circle of hell.

Okay, it's not *that* bad. So, one of the most important facets of NES development is mappers, which are used to extend the maximum amount of space that can be stored on the ROM. This is done using mapper chips, which control which snippets of the ROM data, known as banks, are available at any given moment. There are a **lot** of mappers in use across the NES's library, between licensed, unlicensed, and aftermarket releases; several hundreds, in fact.

For the purposes of testing my emulator I've only implemented mapper 000, also known as NROM. NROM is one of the most basic mappers, in that it really isn't a mapper at all. The banks on NROM cartridges are always fixed, so in the context of the emulator they just need to map three distinct regions of address space at the beginning of execution.

Here's what that looks like:

```gdscript
extends NES_Mapper


func load_initial_map() -> void:
	#CPU $6000-$7FFF: Family Basic only: PRG RAM, mirrored as necessary to fill entire 8 KiB window, write protectable with an external switch
	#CPU $8000-$BFFF: First 16 KB of ROM.
	#CPU $C000-$FFFF: Last 16 KB of ROM (NROM-256) or mirror of $8000-$BFFF (NROM-128).
	_copy_bank_to_ram(0x0 + HEADER_SIZE, 0x8000, 0x4000)
	_copy_bank_to_ram((_16_kb_prg_chunks - 1) * 0x4000 + HEADER_SIZE, 0xC000, 0x4000)
	
	# Unsure about CHR memory, but from observation it seems to copy the first CHR bank to the start of PPU memory
	_copy_bank_to_ram(_16_kb_prg_chunks * 0x4000 + HEADER_SIZE, 0x0000, 0x2000, true)


func get_mapper_id() -> int:
	return 0x0
```

Honestly that's about all I have to say for mappers at the moment. In future updates once things progress a bit more I'd like to tackle more popular mapper chips like MMC3, but one thing at a time.

## Running the Emulator

And now it's time to bring it all together, which also means it's time to talk about the most iffy code I've written for this emulator so far.

So, to begin I need to initialize some stuff when CPU execution begins:

```gdscript
func start_running():
	_cycles = 0
	_scanline = 0
	_frame = 0
	
	_seconds_this_cycle = 0.0
	_seconds_this_scanline = 0.0
	
	init_registers()
	
	ticked.emit()
	_is_running = true
	
	var cpu_thread = Thread.new()
	cpu_thread.start(cpu_loop)
```

Rather than running the CPU on every frame of Godot's execution, I start up a thread which runs a thousand times each frame, and advances a cycle if enough time has passed since the last cycle. In order to roughly match the NES's CPU cycle frequency, I divide the calculated delta time by a number which seems to roughly get the numbers where they should be. Of course, in lieu of actual audiovisual output, I don't really have a great way of testing how accurate the cycle timing is, so this is all placeholder logic currently.


```gdscript
func cpu_loop():
	var last_tick = float(Time.get_ticks_usec())
	
	var runs_per_frame = 10000
	var runs = 0
	
	while _is_running:
		var tick = float(Time.get_ticks_usec())
		var delta = (tick - last_tick) / 1000000.0
		last_delta = delta
		
		runs += 1
		if runs >= runs_per_frame:
			runs = 0
			ticked.emit.call_deferred()
			await get_tree().process_frame
            ...
```

Whenever the CPU cycles, there's a lot of other logic that needs to be attended to: I need to see if enough time has passed to trigger the end of a scanline, if enough cycles have passed to run the next instruction, and if enough scanlines have passed to trigger VBlank. (Currently these checks only care about NTSC timing, another thing that will need to be changed eventually.) When VBlank occurs, the PPU status flag is updated appropriately, and an NMI interrupt is queued, which will intercept the next attempt to tick the CPU.

```gdscript
func cpu_loop():
	var last_tick = float(Time.get_ticks_usec())
	
	var runs_per_frame = 10000
	var runs = 0
	
	while _is_running:
		var tick = float(Time.get_ticks_usec())
		var delta = (tick - last_tick) / 1000000.0
		last_delta = delta
		
		runs += 1
		if runs >= runs_per_frame:
			runs = 0
			ticked.emit.call_deferred()
			await get_tree().process_frame
		
		var adjusted_delta = delta * cpu_speed_multiplier * _fps_throttle
		_seconds_this_cycle += adjusted_delta
		_seconds_this_scanline += adjusted_delta
		
		if _seconds_this_cycle >= NTSC_SECONDS_PER_CYCLE:
			_seconds_this_cycle = 0.0
			
			_cycles += 1
			_cycles_before_next_instruction -= 1
			
			if _seconds_this_scanline > NTSC_CYCLES_PER_SCANLINE * NTSC_SECONDS_PER_CYCLE:
				_scanline += 1
			
			if _scanline > NTSC_SCANLINES:
				# VBlank begins.
				
				_cpu_memory[Consts.PPU_REGISTERS + Consts.PPU_Registers.PPUSTATUS] |= 0x80
				var ppu_ctrl = _cpu_memory[Consts.PPU_REGISTERS + Consts.PPU_Registers.PPUCTRL]
				
				if ppu_ctrl & 0x80 > 0:
					pending_interrupt = Consts.Interrupts.NMI
			
			if _scanline > NTSC_SCANLINES + NTSC_VBLANK_SCANLINES:
				# VBlank ends.
				
				_frame += 1
				_scanline = 0
				
				_cpu_memory[Consts.PPU_REGISTERS + Consts.PPU_Registers.PPUSTATUS] &= 0x7F
			
			if _cycles_before_next_instruction <= 0:
				tick()
		
		last_tick = tick


func tick():
	var pc = registers[Consts.CPU_Registers.PC]
	
	if pending_interrupt == Consts.Interrupts.NMI:
		var old_pc = registers[Consts.CPU_Registers.PC]
		Opcodes.JSR(Opcodes.OperandAddressingContext.new(
			Consts.AddressingModes.Absolute, _nmi_vector
		))
		
		_cycles_before_next_instruction = 5 #TODO: Is this right?
		
		pending_interrupt = Consts.Interrupts.NONE
		
		_cpu_memory[Consts.PPU_REGISTERS + Consts.PPU_Registers.PPUSTATUS] |= 0x80
		
		return
	
	var instruction_data = get_instruction_data(pc)
	
	if instruction_data:
		var starting_operand = instruction_data.context.value
		
		instruction_data.execute()
		
		_cycles_before_next_instruction = Consts.OPCODE_DATA[instruction_data.opcode]['cycles']
		
		#if instruction_data.context.address_mode in [
			#Consts.AddressingModes.Absolute_X, Consts.AddressingModes.Absolute_Y,
			#Consts.AddressingModes.ZPInd_Y, Consts.AddressingModes.Relative
		#]:
			#if starting_operand & 0xFF00 != instruction_data.context.value & 0xFF00:
				#_cycles_before_next_instruction += 1
		
		last_instruction = instruction_data
	else:
		print('Invalid opcode, stopping.')
		_is_running = false
		return
	
	if registers[Consts.CPU_Registers.PC] == pc:
		# Don't increment the program counter if we just jumped
		registers[Consts.CPU_Registers.PC] += instruction_data.bytes_to_read
```

As you can probably tell, a lot of this code is a work in progress still. My understanding of how things like cycle and frame timing work are extremely limited, so what I've got at the moment is more or less guesswork. Still though, I'm quite happy with my progress so far.

## Next Steps

Judging by the articles on [NESDev](https://www.nesdev.org/wiki/PPU_registers), there's a lot happening under the hood regarding the PPU that I haven't touched yet. Specifically, there are a number of registers which trigger the PPU to perform different actions depending on how they're read and written to, so once I implement those I'm hoping that the CPU memory will begin behaving more like it does in the more fleshed out emulators.

After that, my next big goal will probably be to get video output working. I don't have nearly a strong enough grasp of audio generation to think too much about how to approach that aspect, but video I think I can manage.