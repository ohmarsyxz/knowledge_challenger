# Advanced Data Structures & Algorithms
## วิเคราะห์ลึก ออกแบบให้ทนต่อข้อมูลจริง

Note: เปิดด้วย framing ว่า deck นี้ขยับจาก "ใช้ data structure อะไร" ไปสู่ "ทำไมมันเร็ว, เมื่อไรพัง, และ trade-off ไหนคุ้ม".

---

# From Big-O to Real Design
- Big-O คือภาษาเริ่มต้น ไม่ใช่คำตอบสุดท้าย
- ต้องดู **model of computation**: RAM, cache, disk, network, concurrency
- ต้องแยก **worst-case**, **average-case**, **amortized**, และ **expected**
- ต้องถามว่า bottleneck คือ CPU, memory, I/O, lock contention หรือ tail latency

> Algorithm ที่ดีบนกระดาษ อาจแพ้ data layout ที่ดีกว่าใน production

Note: อ้างอิง MIT 6.046 ที่เน้น design/analysis techniques และ MIT 6.851 ที่มอง data structures เป็น building blocks ของ efficient algorithms.

---

# Complexity Lens ที่ควรใช้
- **Upper bound**: algorithm นี้แย่สุดไม่เกินเท่าไร
- **Lower bound**: ปัญหานี้ไม่มีใครทำได้ดีกว่านี้ภายใต้ model เดียวกัน
- **Amortized bound**: operation บางครั้งแพง แต่เฉลี่ยทั้ง sequence ถูก
- **Randomized bound**: guarantee อยู่บน expectation หรือ high probability
- **Output-sensitive**: เวลาขึ้นกับขนาดคำตอบ เช่น **O(n + k)**

Note: ย้ำความต่างระหว่าง average-case กับ amortized. Average-case ต้องมี distribution ของ input; amortized ไม่ต้องสุ่ม input แต่ดู sequence ของ operations.

---

# Amortized Analysis: Dynamic Array
- `push` ส่วนใหญ่เป็น **O(1)**
- ตอน capacity เต็ม ต้อง allocate ใหม่และ copy ทั้งหมด เป็น **O(n)**
- ถ้าโตแบบคูณ 2 ค่า copy รวมทั้ง sequence ยังเป็น **O(n)**
- ดังนั้น `n` ครั้งของ push มี amortized cost เป็น **O(1)** ต่อครั้ง

```typescript
class Vector<T> {
  private data: T[] = [];
  private capacity = 1;

  push(value: T) {
    if (this.data.length === this.capacity) {
      this.capacity *= 2;
      // real implementation copies to a larger buffer
    }
    this.data.push(value);
  }
}
```

Note: ใช้ accounting method: คิดเงินเกินนิดหน่อยใน push ราคาถูก เพื่อจ่ายค่าคัดลอกตอน resize. ประเด็นสำคัญคือ growth factor ต้องมากกว่า 1.

---

# Hash Table: เร็วเมื่อ assumption ถูก
- Average lookup เป็น **O(1)** เมื่อ hash กระจายดีและ load factor ถูกคุม
- Worst-case เป็น **O(n)** ถ้า collision รวมกันหนัก
- Randomized hashing ลดโอกาส adversarial input
- Open addressing เร็วจาก cache locality แต่ลบยากกว่า chaining
- Rehash เป็น amortized cost ไม่ใช่ free operation

Note: สไลด์นี้ควรทำให้ผู้ฟังเลิกพูดว่า hash map คือ O(1) แบบไม่มีเงื่อนไข. ในระบบจริง hash flooding, key distribution, และ resizing policy สำคัญมาก.

---

# Cache Locality: Complexity ที่ Big-O ไม่เห็น
![Memory Layout](https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80)
- Array scan แบบ **O(n)** อาจชนะ linked list ที่เป็น **O(n)** เหมือนกัน
- Pointer chasing ทำให้ CPU cache miss บ่อย
- B-tree ลดจำนวน disk/page reads ด้วย branching factor ใหญ่
- Struct-of-arrays อาจเร็วกว่า array-of-structs ในงาน vectorized

Note: อธิบายว่า Big-O นับจำนวน operation แบบ abstract แต่ modern hardware มี cache line, branch prediction, prefetching และ memory hierarchy.

---

# Union-Find: เล็ก แต่ทรงพลัง
- ใช้ตอบว่า item สองตัวอยู่ component เดียวกันไหม
- **Union by rank** + **path compression**
- Amortized time ใกล้ constant: **O(α(n))**
- ใช้ใน Kruskal MST, dynamic connectivity, image segmentation, type unification

```typescript
function find(x: number): number {
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}

function union(a: number, b: number) {
  let ra = find(a);
  let rb = find(b);
  if (ra === rb) return;
  if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
  parent[rb] = ra;
  if (rank[ra] === rank[rb]) rank[ra]++;
}
```

Note: α(n) คือ inverse Ackermann function โตช้ามากจนในการใช้งานแทบเหมือน constant แต่ยังเป็น bound ที่มีความหมายเชิงทฤษฎี.

---

# Balanced Trees: Invariant คือหัวใจ
- BST ปกติอาจเอียงจนกลายเป็น linked list
- AVL คุม height เข้มกว่า lookup เร็ว แต่ rotate บ่อยขึ้น
- Red-Black Tree ผ่อนกว่า เหมาะกับ ordered map/set ทั่วไป
- B-tree/B+tree ออกแบบเพื่อ page/disk/cache block
- Skip list ใช้ randomization แทนการ maintain rotation

Note: เปลี่ยนคำถามจาก "tree เร็วไหม" เป็น "invariant อะไรทำให้ height ถูกคุม และค่า maintenance คุ้มไหม".

---

# Range Query Structures
- **Prefix Sum**: query sum **O(1)**, update แพง
- **Fenwick Tree**: prefix query/update **O(log n)**, implementation สั้น
- **Segment Tree**: flexible aggregate, range update, lazy propagation
- **Sparse Table**: static idempotent query เช่น min/max เป็น **O(1)**
- เลือกจาก pattern: static vs dynamic, point vs range, invertible vs non-invertible

Note: ใช้สไลด์นี้กับโจทย์ analytics, leaderboard, time-series, และ interval problems. Fenwick เหมาะกับ sum/frequency; segment tree เหมาะกับ operation หลากหลายกว่า.

---

# Priority Queue: ไม่ได้มีแค่ Heap เดียว
- Binary heap: simple, cache-friendly, push/pop **O(log n)**
- d-ary heap: ลด height แต่เพิ่ม cost ตอนเลือก child
- Fibonacci heap: decrease-key ดีเชิงทฤษฎี แต่ constant สูง
- Pairing heap: practical compromise ในบาง workload
- Dijkstra เร็วหรือช้า ขึ้นกับ priority queue และ graph density

Note: อธิบายว่า textbook complexity เช่น Dijkstra + Fibonacci heap ไม่ได้แปลว่าจะเร็วสุดใน production. Constants และ memory behavior มีผลมาก.

---

# Graph Representation Trade-offs
![Graph Systems](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)
- Adjacency list: ดีสำหรับ sparse graph, traversal เป็น **O(V + E)**
- Adjacency matrix: edge lookup **O(1)** แต่ space **O(V²)**
- CSR/CSC: เหมาะกับ graph ใหญ่และ linear algebra style processing
- Edge list: ดีสำหรับ sort edges เช่น Kruskal

Note: ถ้า graph ใหญ่มาก representation คือ algorithm ไปแล้วครึ่งหนึ่ง. Layout ที่ดีลด memory footprint และทำให้ traversal predictable.

---

# Shortest Path Decision Matrix
- Unweighted graph: **BFS**
- Non-negative weights: **Dijkstra**
- Negative edges, no negative cycle: **Bellman-Ford**
- All-pairs dense graph: **Floyd-Warshall**
- All-pairs sparse graph: **Johnson**
- Heuristic route planning: **A\*** เมื่อ heuristic admissible

> Algorithm ที่ถูกต้องขึ้นกับ constraint ของ edge weights

Note: ย้ำว่าการใช้ Dijkstra กับ negative edge เป็น bug ทาง algorithm ไม่ใช่ optimization issue.

---

# MST: Cut Property มาก่อน Code
- Kruskal เลือก edge เบาสุดที่ไม่ทำ cycle
- Prim ขยาย tree ด้วย edge ถูกสุดจาก frontier
- Boruvka รวม component หลายชุดพร้อมกัน
- Correctness มาจาก **cut property** และ **cycle property**
- Implementation มักผูกกับ union-find หรือ priority queue

Note: สไลด์นี้เน้นพิสูจน์ intuition: edge ที่เบาสุดข้าม cut ใด ๆ ปลอดภัยที่จะอยู่ใน MST บางตัว.

---

# DAG, SCC, และ Condensation Graph
- Topological sort ใช้กับ dependency scheduling
- Cycle ใน dependency graph คือ failure mode สำคัญ
- SCC รวม node ที่ reach หากันได้ทั้งสองทิศ
- Condensation graph ของ SCC เป็น DAG เสมอ
- ช่วยย่อยปัญหา graph ใหญ่ให้เป็น component-level problem

Note: ใช้ตัวอย่าง package dependency, build pipeline, module graph, service call graph. SCC สำคัญมากในการ debug architecture.

---

# Dynamic Programming: State คือ Design
- นิยาม state ให้พออธิบายอดีตที่จำเป็น
- transition ต้องลดปัญหาไปหา state ที่เล็กกว่า
- memoization เปลี่ยน recursion tree เป็น DAG
- tabulation ช่วยคุม order และ memory
- optimization: rolling array, bitmask DP, divide-and-conquer DP, Knuth optimization

Note: อย่าเริ่มจากสูตร recurrence ให้เริ่มจาก "ข้อมูลขั้นต่ำอะไรที่ต้องจำเพื่อเลือกต่อได้ถูก".

---

# DP Example: Longest Increasing Subsequence
- DP ตรงไปตรงมา: `dp[i]` = LIS ที่จบที่ `i` → **O(n²)**
- วิธี advanced ใช้ `tails[len]` เก็บค่าท้ายสุดที่เล็กที่สุด
- หา position ด้วย binary search → **O(n log n)**
- ไม่ได้เก็บ sequence เต็มโดยตรง แต่เก็บ invariant ที่พอสำหรับ length

```typescript
function lisLength(values: number[]) {
  const tails: number[] = [];
  for (const x of values) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}
```

Note: นี่เป็นตัวอย่างที่ดีของการเปลี่ยน representation ของ state แล้ว complexity ลดจาก quadratic เป็น n log n.

---

# String Algorithms: Index ก่อน Search
- Trie: prefix query เร็ว แต่ใช้ memory สูง
- KMP: substring search **O(n + m)** ด้วย failure function
- Rolling hash: เร็วและง่าย แต่มี collision risk
- Suffix array: search substring ด้วย binary search บน suffix order
- Suffix automaton/tree: powerful แต่ implementation ซับซ้อนกว่า

Note: ใช้กับ autocomplete, log search, plagiarism detection, genome matching. เลือกตาม query pattern และ memory budget.

---

# Probabilistic Data Structures
- **Bloom Filter**: membership test ไม่มี false negative แต่มี false positive
- **Count-Min Sketch**: frequency estimate แบบ overestimate
- **HyperLogLog**: cardinality estimate ด้วย memory น้อยมาก
- **Reservoir Sampling**: sample จาก stream ขนาดไม่รู้ล่วงหน้า
- เหมาะเมื่อ exactness แพงเกินไป แต่ error bound รับได้

Note: อธิบายว่า advanced system design หลายครั้งไม่ได้ต้องการคำตอบ exact ถ้า approximate answer ลด memory/latency ได้มหาศาล.

---

# Persistent & Immutable Structures
- Version เก่ายังใช้ได้หลัง update
- Path copying ทำให้ update แตะเฉพาะ node บนเส้นทาง
- เหมาะกับ undo/redo, snapshot isolation, functional programming
- Trade-off คือ allocation และ garbage collection pressure
- Structural sharing ลด memory แต่เพิ่ม pointer indirection

Note: เชื่อมกับ React/Redux, compiler symbol tables, database MVCC, และ collaborative editing.

---

# Online vs Offline Algorithms
- Online: ต้องตัดสินใจทันทีเมื่อข้อมูลมาถึง
- Offline: เห็น input ทั้งหมดก่อน จึง sort/group/precompute ได้
- Sweep line แปลง geometry/event problems เป็น ordered events
- Mo's algorithm reorder query เพื่อลด pointer movement
- Difference array จัดการ batch range updates ได้ถูกมาก

Note: ถ้าโจทย์อนุญาต offline processing มักมี optimization ใหญ่ซ่อนอยู่ เช่น sort events ก่อนแทนการ query สดทุกครั้ง.

---

# Lower Bounds & Reductions
- Comparison sorting มี lower bound **Ω(n log n)**
- ถ้าทำได้เร็วกว่า ต้องใช้ assumption เพิ่ม เช่น integer/radix sort
- Reduction ใช้พิสูจน์ว่า problem หนึ่งยากอย่างน้อยเท่าอีก problem
- NP-complete ไม่ได้แปลว่าแก้ไม่ได้ แต่แปลว่าอย่าหวัง polynomial exact ทั่วไป
- เลือก approximation, heuristic, parameterized, หรือ constraint-specific algorithm

Note: สไลด์นี้ให้มุมมอง senior: บางครั้ง "optimize เพิ่ม" ไม่ใช่คำตอบ ต้องเปลี่ยน requirement หรือ exploit structure ของ input.

---

# Case Study: Feed Ranking Pipeline
- Candidate generation ใช้ approximate nearest neighbor หรือ inverted index
- Dedup/grouping ใช้ hash set แต่ต้องระวัง memory และ key design
- Ranking ใช้ heap เพื่อเก็บ top-k แทน sort ทั้งหมด
- Feature aggregation ใช้ sketches/cache เพื่อคุม latency
- Graph signals ใช้ traversal จำกัด depth เพื่อเลี่ยง explosion

Note: ตัวอย่างนี้เชื่อมหลาย concept ใน production: approximate DS, top-k heap, graph expansion, cache, และ latency budget.

---

# Case Study: Route Planning
- Road network เป็น sparse weighted graph
- Dijkstra ถูกต้อง แต่ query สดบน graph ใหญ่อาจช้า
- A* ใช้ heuristic เพื่อบีบ search space
- Bidirectional search ลด frontier จากสองฝั่ง
- Preprocessing เช่น contraction hierarchies แลก update cost กับ query speed

Note: ย้ำว่า advanced algorithm design มักเป็นการย้าย cost: จาก query ไป preprocessing, จาก exact ไป approximate, จาก memory ไป latency.

---

# Advanced Checklist
- Bound ที่ต้องการคือ worst-case, amortized, expected หรือ tail latency?
- Input มี distribution, adversarial risk, หรือ update/query ratio แบบไหน?
- Data อยู่ใน RAM, cache, disk, network หรือหลาย tier?
- ต้องการ exact answer หรือ approximate พร้อม error bound?
- มี lower bound หรือ reduction ที่บอกว่าอย่าฝืนไหม?
- Precompute ได้ไหม หรือเป็น online stream?

Note: ใช้ checklist นี้เป็นเครื่องมือ review design ก่อน commit กับ architecture.

---

# แหล่งข้อมูลที่ใช้
- MIT OpenCourseWare: 6.046J Design and Analysis of Algorithms
- MIT OpenCourseWare: 6.851 Advanced Data Structures
- Princeton Algorithms, 4th Edition booksite
- NIST Dictionary of Algorithms and Data Structures
- Open Data Structures by Pat Morin

Note: URLs: https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/ , https://ocw.mit.edu/courses/6-851-advanced-data-structures-spring-2012/ , https://algs4.cs.princeton.edu/home/ , https://xlinux.nist.gov/dads/ , https://opendatastructures.org/

---

# Discussion
## เราไม่ได้เลือก algorithm ที่เร็วที่สุด
## เราเลือก trade-off ที่ถูกต้องที่สุด

Note: ปิดด้วยคำถาม: ในระบบจริงของทีม bottleneck อยู่ตรงไหน และ structure ไหนจะย้าย cost ไปยังจุดที่รับได้มากกว่า?
