import { Flashcard, WhiteboardPuzzle } from '../types/curriculum';

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    company: 'QUALCOMM WIRELESS SOC',
    role: 'Physical Verification & Low Power',
    topic: 'Keeper Cells & Floating Gates',
    category: 'Architecture',
    question: 'Can an ASIC wire net hold a voltage state without an active continuous driver? Explain keeper and bus-hold circuits.',
    answer: 'Standard ASIC metal wires cannot hold state due to sub-threshold leakage discharging the parasitic capacitance (C_wire). In IO pad rings or low-power sleep domains, designers employ a Bus Holder Cell (two cross-coupled weak back-to-back inverters). This prevents high-impedance inputs from floating into the linear threshold region where excessive static crowbar current is drawn.',
  },
  {
    id: 'fc-2',
    company: 'NVIDIA GPU ARCH',
    role: 'Silicon Sign-off & Functional Equivalence',
    topic: 'X-Optimism vs X-Pessimism',
    category: 'Verilog',
    question: 'Explain X-optimism vs X-pessimism in RTL simulation versus real silicon standard cell gate behavior.',
    answer: 'X-optimism occurs in RTL if-statements where 1\'bx falls through to the else branch, masking bugs in simulation that lock real chips into deadlocks. X-pessimism occurs in gate-level simulations where a boolean expression like A & ~A evaluates to X when A=X, even though physically the circuit output is always 0. Formal equivalence (Formality/Conformal) and SDF gate-level simulation ensure sign-off parity.',
  },
  {
    id: 'fc-3',
    company: 'GOOGLE SILICON (TPU)',
    role: 'Front-End Sign-off & Interconnect',
    topic: 'FinFET Bus Structures',
    category: 'Architecture',
    question: 'Why do we avoid internal tri-state buses in FinFET nodes, and what replaces them in large on-chip crossbars?',
    answer: 'Modern FinFET nodes (TSMC N5/N3) replace tri-state shared buses with Point-to-Point Multiplexer Trees or OR-based and AND-OR MUX trees. These structures guarantee fully driven static nets at all times, simplify Static Timing Analysis (STA), and eliminate floating-node DRC violations during tape-out signoff.',
  },
  {
    id: 'fc-4',
    company: 'ANALOG DEVICES',
    role: 'Mixed-Signal RTL Design',
    topic: 'Inadvertent Latch Inference',
    category: 'Synthesis',
    question: 'An FPGA engineer writes reg [7:0] data inside a combinational logic block. Walk me through the ASIC Netlist output.',
    answer: 'If the always @(*) block fully defines assignments for all inputs, Synopsys Design Compiler synthesizes pure combinational logic (e.g. NAND/NOR gates). However, if an if statement lacks an else, the tool infers a transparent latch (LD_X1) to preserve previous state, which is strictly prohibited in synchronous digital ASIC design flows.',
  },
  {
    id: 'fc-5',
    company: 'APPLE SILICON',
    role: 'Core Arch & Microarchitecture',
    topic: 'Clock Domain Crossing & MTBF',
    category: 'CDC',
    question: 'Why does adding a 3rd flip-flop to a 2-FF synchronizer improve MTBF by orders of magnitude?',
    answer: 'The Mean Time Between Failures MTBF equation is proportional to e^(s * t_r) / (T_0 * f_clk * f_data), where t_r is the resolution time. Inserting a 3rd flip-flop adds an entire extra clock period to t_r, causing an exponential surge in MTBF from hundreds of hours to thousands of years.',
  },
  {
    id: 'fc-6',
    company: 'BROADCOM SWITCHING SILICON',
    role: 'High-Speed Networking Core',
    topic: 'Setup vs Hold Time Fixes',
    category: 'STA',
    question: 'Why do backend place-and-route tools prioritize hold violations over setup violations before tape-out sign-off?',
    answer: 'A setup time violation can be worked around in silicon by lowering the operational clock frequency (e.g. downclocking from 1.25 GHz to 1.0 GHz). A hold time violation is a catastrophic manufacturing defect: data races ahead into the next flop regardless of how slowly you run the clock, bricking the chip entirely. Hold buffers must be physically inserted during CTS.',
  },
];

export const WHITEBOARD_PUZZLES: WhiteboardPuzzle[] = [
  {
    id: 'puz-1',
    title: 'Asynchronous FIFO Depth Calculation',
    company: 'NVIDIA / Apple Silicon',
    frequency: 'Extremely High (Top 1%)',
    difficulty: 'Hard',
    prompt: `Given:
- Write Clock (f_w) = 100 MHz (Period = 10 ns)
- Read Clock (f_r) = 60 MHz (Period = 16.66 ns)
- Burst Size = 100 data words back-to-back
- Read latency: 1 read per cycle (no idle cycles)
Calculate the minimal theoretical depth required for an asynchronous FIFO without any data drop.`,
    hints: [
      'Calculate the total time required to write 100 data words: T_burst = 100 * 10 ns = 1000 ns.',
      'In that 1000 ns window, calculate how many words the 60 MHz read clock can read.',
      'Read words = floor(1000 ns / 16.66 ns) = 60 words.',
      'Required FIFO Depth = Burst - Read = 100 - 60 = 40 words.',
      'Round up to the nearest power of 2 for Gray pointer code wrap-around: 64 words!',
    ],
    solutionExplanation: `1. Time to write burst of 100 words = 100 / 100MHz = 1000 ns.
2. Number of words read in 1000 ns = 1000 ns / 16.66 ns = 60 words.
3. Remaining unread words stored in FIFO = 100 - 60 = 40 words.
4. Asynchronous FIFOs require power-of-2 depth for symmetrical Gray counter wrap-around:
Depth = 2^(ceil(log2(40))) = 64 words.`,
    verilogSolution: `module async_fifo #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 6 // 2^6 = 64 depth
)(
    input  wire                  wclk, wrst_n, winc,
    input  wire [DATA_WIDTH-1:0] wdata,
    output wire                  wfull,
    input  wire                  rclk, rrst_n, rinc,
    output wire [DATA_WIDTH-1:0] rdata,
    output wire                  rempty
);
    // Dual-clock Clifford Cummings canonical implementation
    // Gray pointer conversion and 2-FF cross synchronizers
endmodule`,
  },
  {
    id: 'puz-2',
    title: '50% Duty Cycle Divide-by-3 Clock Generator',
    company: 'Qualcomm / AMD',
    frequency: 'Very High (Top 3%)',
    difficulty: 'Medium',
    prompt: `Design a synthesizable Verilog module that takes a 300 MHz input clock and generates a 100 MHz (divide-by-3) output clock with a guaranteed 50% duty cycle. No external analog PLL or DLL may be used.`,
    hints: [
      'An odd integer divider cannot produce 50% duty cycle using only one edge of the clock (pos-edge gives 33.3% or 66.6%).',
      'Use both posedge and negedge flip-flops.',
      'Generate a 1/3 duty signal on posedge, and a phase-shifted 1/3 duty signal on negedge.',
      'OR the two pulses together to synthesize an exact 50% duty cycle (1.5 cycles high, 1.5 cycles low)!',
    ],
    solutionExplanation: `By triggering one counter on posedge clk and a matching delayed flop on negedge clk, the combinatorial OR of the two signals widens the high duration by exactly 0.5 T_clk, transforming a 33.3% pulse (1 cycle high, 2 cycles low) into 1.5 cycles high and 1.5 cycles low = 50.0% duty cycle!`,
    verilogSolution: `module clk_div3_50pct (
    input  wire clk_in,
    input  wire rst_n,
    output wire clk_out
);
    reg [1:0] pos_cnt;
    reg [1:0] neg_cnt;

    // Positive edge counter (0 -> 1 -> 2 -> 0)
    always @(posedge clk_in or negedge rst_n) begin
        if (!rst_n) pos_cnt <= 2'b00;
        else if (pos_cnt == 2'd2) pos_cnt <= 2'b00;
        else pos_cnt <= pos_cnt + 1'b1;
    end

    // Negative edge counter following pos_cnt
    always @(negedge clk_in or negedge rst_n) begin
        if (!rst_n) neg_cnt <= 2'b00;
        else neg_cnt <= pos_cnt;
    end

    // Synthesis OR generates exact 50% duty:
    // (pos_cnt != 2) is high for 2 cycles; AND with neg_cnt creates 1.5-cycle high
    assign clk_out = (pos_cnt != 2'd2) && (neg_cnt != 2'd2);

endmodule`,
  },
  {
    id: 'puz-3',
    title: 'Glitch-Free Dual-Clock Multiplexer',
    company: 'Broadcom / Google TPU',
    frequency: 'High (Top 5%)',
    difficulty: 'Hard',
    prompt: `Design a glitch-free clock multiplexer that switches dynamically between clk0 (e.g. 50MHz) and clk1 (e.g. 200MHz) upon a select toggle without ever generating an intermediate runt clock pulse.`,
    hints: [
      'A simple combinational mux (assign clk_out = sel ? clk1 : clk0;) produces deadly runt pulses when sel switches mid-phase.',
      'Use negative-edge triggered flip-flops with cross-coupled feedback.',
      'Ensure clk0 is completely turned off and its output holds low before clk1 is allowed to turn on.',
    ],
    solutionExplanation: `Standard ASIC standard cell clock mux topology: Two feedback loops clocked on negative edges. When select transitions, the currently active clock de-asserts its enable on its next falling edge. Only after that falling edge has arrived and been synchronized to the other domain does the target clock enable. Because all gating occurs while the clocks are low, no runt pulse can ever be propagated to the clock tree.`,
    verilogSolution: `module glitchless_clk_mux (
    input  wire clk0,
    input  wire clk1,
    input  wire sel,
    input  wire rst_n,
    output wire clk_out
);
    reg q0_d1, q0_d2;
    reg q1_d1, q1_d2;

    // Domain 0 Negedge Synchronizer with cross-inhibition from Domain 1
    always @(negedge clk0 or negedge rst_n) begin
        if (!rst_n) begin
            q0_d1 <= 1'b0;
            q0_d2 <= 1'b0;
        end else begin
            q0_d1 <= (~sel) & (~q1_d2);
            q0_d2 <= q0_d1;
        end
    end

    // Domain 1 Negedge Synchronizer with cross-inhibition from Domain 0
    always @(negedge clk1 or negedge rst_n) begin
        if (!rst_n) begin
            q1_d1 <= 1'b0;
            q1_d2 <= 1'b0;
        end else begin
            q1_d1 <= (sel) & (~q0_d2);
            q1_d2 <= q1_d1;
        end
    end

    // Glitch-free clock output
    assign clk_out = (clk0 & q0_d2) | (clk1 & q1_d2);

endmodule`,
  },
];
