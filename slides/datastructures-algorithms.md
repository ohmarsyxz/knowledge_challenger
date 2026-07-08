# Data Structures & Algorithms
## คิดให้เป็นระบบ เขียนโปรแกรมให้โตได้

Note: เปิดด้วยแนวคิดว่า Data Structures & Algorithms ไม่ใช่วิชาท่องจำ แต่เป็นภาษากลางในการคุยเรื่อง performance, scalability, และ trade-off ของระบบซอฟต์แวร์.

---

# ทำไมเรื่องนี้สำคัญ
- โค้ดที่ดูถูกต้อง อาจช้าเกินไปเมื่อข้อมูลโตขึ้น
- โครงสร้างข้อมูลกำหนด "ค่าใช้จ่าย" ของการอ่าน เขียน ค้นหา และลบ
- อัลกอริทึมคือขั้นตอนตัดสินใจว่าจะจัดการข้อมูลอย่างไร
- เป้าหมายไม่ใช่เลือกสิ่งที่เร็วที่สุดเสมอ แต่เลือกสิ่งที่เหมาะกับงานที่สุด

Note: อ้างอิง MIT OCW 6.006 ที่อธิบายว่าหลักสูตร algorithms เน้นความสัมพันธ์ระหว่าง algorithms, programming, performance measures, และ analysis techniques: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/

---

# Data Structure vs Algorithm
![Structured Data](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80)
- **Data Structure**: วิธีจัดเก็บข้อมูลและความสัมพันธ์ของข้อมูล
- **Algorithm**: ขั้นตอนแก้ปัญหาหรือแปลงข้อมูลจาก input เป็น output
- **คู่กันเสมอ**: โครงสร้างข้อมูลที่ดี ทำให้อัลกอริทึมง่ายและเร็วขึ้น
- **คำถามหลัก**: งานนี้อ่านบ่อย เขียนบ่อย ค้นหาบ่อย หรือเรียงลำดับบ่อย?

Note: ใช้ภาพรวมจาก NIST Dictionary of Algorithms and Data Structures และ Open Data Structures ซึ่งจัดหมวดข้อมูลเป็น sequences, queues, dictionaries, trees, graphs: https://xlinux.nist.gov/dads/ และ https://opendatastructures.org/

---

# Big-O: ภาษาของการเติบโต
- **O(1)**: ไม่ขึ้นกับขนาดข้อมูล เช่น อ่านค่าจาก array index
- **O(log n)**: ลดพื้นที่ค้นหาทีละครึ่ง เช่น binary search
- **O(n)**: ต้องไล่ดูข้อมูลตามจำนวน item
- **O(n log n)**: กลุ่ม sort ที่มีประสิทธิภาพ เช่น merge sort, quicksort โดยเฉลี่ย
- **O(n^2)**: มักเกิดจาก nested loop บนข้อมูลชุดใหญ่

> Big-O ช่วยตอบว่า "เมื่อ n โตขึ้น โค้ดจะรับมือไหวแค่ไหน"

Note: NIST ให้นิยาม Big-O ว่าเป็นมาตรวัดเชิงทฤษฎีของเวลา/หน่วยความจำตาม problem size n และย้ำว่าต้องผูกกับ model of computation: https://xlinux.nist.gov/dads/HTML/bigOnotation.html

---

# วิธีคิด Big-O แบบเร็ว
- มองหา input size ก่อน: ให้จำนวนข้อมูลเป็น **n**
- ตัดค่าคงที่ออก: **2n + 10** เหลือ **O(n)**
- เก็บพจน์ที่โตเร็วที่สุด: **n^2 + n** เหลือ **O(n^2)**
- โค้ดต่อกันให้นำมาบวก แล้วเลือกตัวที่โตสุด
- ลูปซ้อนกันให้นำมาคูณ เช่น **n x n = O(n^2)**

Note: ย้ำว่า Big-O สนใจแนวโน้มเมื่อข้อมูลโต ไม่ใช่เวลาจริงเป็นมิลลิวินาที. เวลา actual runtime ยังขึ้นกับเครื่อง ภาษา memory layout network และ I/O.

---

# ตัวอย่างการอ่าน Big-O จากโค้ด
- `firstItem` อ่านตำแหน่งเดียว จึงเป็น **O(1)**
- `sumScores` เดินครบทุก item จึงเป็น **O(n)**
- `hasDuplicate` เทียบทุกคู่ จึงเป็น **O(n^2)**

```typescript
function firstItem(items: number[]) {
  return items[0];
}

function sumScores(scores: number[]) {
  let total = 0;
  for (const score of scores) total += score;
  return total;
}

function hasDuplicate(values: number[]) {
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] === values[j]) return true;
    }
  }
  return false;
}
```

Note: ชี้ให้เห็นว่า hasDuplicate อาจ return เร็วใน best case แต่ Big-O ที่มักใช้คุยกันคือ worst case: ถ้าไม่มีค่าซ้ำเลย ต้องเทียบเกือบทุกคู่.

---

# Big-O ยากขึ้น: หลาย input
- อย่ารีบรวมทุกอย่างเป็น **n** ถ้า input คนละชุดกัน
- ถ้าวน `users` แล้วซ้อน `products` คือ **O(u x p)**
- ถ้าวนแยกกันคนละรอบ คือ **O(u + p)**
- ถ้า `u` และ `p` โตคนละทาง การแยกชื่อช่วยให้วิเคราะห์แม่นกว่า

```typescript
function recommend(users: User[], products: Product[]) {
  for (const user of users) {
    for (const product of products) {
      score(user, product);
    }
  }
}
```

Note: ถ้า users มี 1 ล้าน แต่ products มี 20 การพูดว่า O(n^2) จะทำให้เข้าใจผิดได้ง่ายกว่า O(u x p). Big-O ที่ดีควรสะท้อน input จริงของปัญหา.

---

# Big-O ยากขึ้น: Loop ที่หลอกตา
- `i *= 2` ทำให้จำนวนรอบเป็น **log n**
- loop นอก **log n** ซ้อน loop ใน **n** จึงเป็น **O(n log n)**
- loop ที่วิ่งครึ่งหนึ่ง สามเหลี่ยม หรือ `j = i` มักยังเป็น **O(n^2)**

```typescript
function repeatedScan(items: number[]) {
  for (let window = 1; window < items.length; window *= 2) {
    for (const item of items) {
      inspect(item, window);
    }
  }
}
```

Note: อธิบายว่า window มีค่า 1, 2, 4, 8, ... จนถึง n จึงมีประมาณ log2(n) รอบ ไม่ใช่ n รอบ. แต่ในแต่ละรอบยัง scan items ทั้งหมด.

---

# Big-O ยากขึ้น: Recursion & Branching
- **Merge Sort**: แบ่งครึ่ง 2 ฝั่ง แล้วรวมผลทุกชั้นเป็น **O(n log n)**
- **Binary Search**: เลือกไปต่อแค่ครึ่งเดียวเป็น **O(log n)**
- **Fibonacci naive**: แตกเป็น 2 ทางซ้ำ ๆ เป็น **O(2^n)**
- **Subset generation**: แต่ละ item มีเลือก/ไม่เลือกเป็น **O(2^n)**
- **Graph traversal**: เยี่ยมทุก node และ edge เป็น **O(V + E)**

> ถ้า recursion แตกหลายทาง ให้ระวัง exponential growth

Note: เทคนิคเร็วคือถามว่าแต่ละชั้นทำงานเท่าไร และมีทั้งหมดกี่ชั้น. ถ้าแตกเป็นหลาย branch โดยไม่มี memoization ความซ้ำจะโตเร็วมาก.

---

# Linear Structures
![Stack and Queue](https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=1200&q=80)
- **Array / Dynamic Array**: อ่านด้วย index เร็ว เหมาะกับข้อมูลต่อเนื่อง
- **Linked List**: แทรก/ลบ node สะดวก แต่ค้นหาต้องเดินทีละ node
- **Stack**: Last-In, First-Out ใช้กับ undo, call stack, parsing
- **Queue**: First-In, First-Out ใช้กับงานรอคิว, event loop, message queue

Note: NIST นิยาม stack ว่าลบได้เฉพาะ item ล่าสุดที่เพิ่มเข้ามา และ queue ว่าเข้าถึง item ที่เพิ่มเข้ามาก่อนสุด: https://xlinux.nist.gov/dads/HTML/stack.html และ https://xlinux.nist.gov/dads/HTML/queue.html

---

# Stack & Queue ในโค้ด
- ใช้ stack เมื่อ state ล่าสุดต้องถูกจัดการก่อน
- ใช้ queue เมื่อความยุติธรรมของลำดับมาก่อนความเร่งด่วน
- ทั้งคู่ควรทำ push/pop หรือ enqueue/dequeue ได้ใกล้เคียง **O(1)**

```typescript
const stack: string[] = [];
stack.push("open modal");
stack.push("edit title");
const lastAction = stack.pop();

const queue: string[] = [];
let head = 0;
queue.push("job-1");
queue.push("job-2");
const nextJob = queue[head++];
```

Note: ย้ำว่าถ้าใช้ Array.shift() ใน JavaScript/TypeScript จะมีต้นทุน O(n) เพราะต้องเลื่อนสมาชิกที่เหลือ ตัวอย่างนี้ใช้ head pointer เพื่อสื่อแนวคิด dequeue แบบ O(1).

---

# Hash Table
![Hash Map](https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80)
- เก็บข้อมูลแบบ **key-value** เพื่อค้นหาด้วย key
- ใช้ hash function แปลง key เป็นตำแหน่งใน array
- โดยเฉลี่ย lookup/insert/delete มักใกล้เคียง **O(1)**
- ต้องจัดการ **collision** เมื่อหลาย key ไปตกตำแหน่งเดียวกัน

Note: NIST อธิบาย hash table ว่าเป็น dictionary ที่ map key ไปยังตำแหน่ง array ด้วย hash function และ complexity ขึ้นกับ hash function กับ collision resolution: https://xlinux.nist.gov/dads/HTML/hashtab.html

---

# Trees: คิดเป็นลำดับชั้น
- **Tree** เริ่มจาก root แล้วแตกเป็น child nodes
- เหมาะกับข้อมูลแบบ hierarchy เช่น DOM, filesystem, org chart
- **Binary Search Tree** เก็บ key น้อยกว่าไว้ซ้าย มากกว่าไว้ขวา
- ถ้า tree สมดุล การค้นหามักใกล้เคียง **O(log n)**; ถ้าเอียงมากอาจแย่เป็น **O(n)**

Note: NIST นิยาม tree เป็นโครงสร้างที่เข้าถึงจาก root node และ BST เป็น binary tree ที่ left subtree มี key น้อยกว่า node และ right subtree มี key มากกว่า: https://xlinux.nist.gov/dads/HTML/tree.html และ https://xlinux.nist.gov/dads/HTML/binarySearchTree.html

---

# Graphs: เมื่อทุกอย่างเชื่อมกัน
![Network Graph](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)
- Graph = **vertices/nodes** + **edges**
- ใช้กับ social network, routing, dependency graph, recommendation
- **Adjacency List**: ประหยัดพื้นที่ เหมาะกับ graph ที่ sparse
- **Adjacency Matrix**: เช็ค edge เร็ว แต่ใช้พื้นที่ **O(V^2)**

Note: NIST นิยาม graph เป็นชุดของ vertices ที่เชื่อมด้วย edges และบอกว่า trees เป็น graph ชนิดพิเศษแบบหนึ่ง: https://xlinux.nist.gov/dads/HTML/graph.html

---

# Traversal: DFS vs BFS
- **DFS**: ลงลึกก่อน เหมาะกับ backtracking, cycle detection, dependency traversal
- **BFS**: กระจายเป็นชั้นก่อน เหมาะกับ shortest path แบบ unweighted
- ทั้งสองแบบมักใช้เวลา **O(V + E)** เมื่อเยี่ยมทุก node และ edge
- โครงสร้างช่วยจำ: DFS ใช้ stack, BFS ใช้ queue

```typescript
type GraphNode = { neighbors: GraphNode[] };

function bfs(start: GraphNode) {
  const queue = [start];
  const seen = new Set<GraphNode>([start]);
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];
    for (const next of node.neighbors) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
}
```

Note: อธิบายด้วยภาพว่า DFS เหมือนเดินเข้าซอยให้สุดก่อนถอยกลับ ส่วน BFS เหมือนคลื่นน้ำที่ขยายออกทีละชั้น. สำหรับ graph ที่ไม่ถ่วงน้ำหนัก BFS ให้จำนวน edge น้อยที่สุดจากจุดเริ่มต้น.

---

# Binary Search
- ใช้ได้เมื่อข้อมูล **เรียงลำดับแล้ว**
- เปรียบเทียบกับค่ากลาง แล้วตัดครึ่งที่เป็นไปไม่ได้ทิ้ง
- ใช้เวลา **O(log n)** เพราะ search space หดลงครึ่งหนึ่งทุกครั้ง
- ระวัง overflow ตอนคำนวณ midpoint ในภาษาที่ integer มีขอบเขต

```typescript
function binarySearch(values: number[], target: number): number {
  let low = 0;
  let high = values.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (values[mid] === target) return mid;
    if (values[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  return -1;
}
```

Note: NIST ระบุว่า binary search ค้นหา sorted array โดยแบ่ง interval ครึ่งหนึ่งซ้ำ ๆ และแนะนำ midpoint แบบ low + (high - low)/2 เพื่อเลี่ยง overflow: https://xlinux.nist.gov/dads/HTML/binarySearch.html

---

# Sorting: จัดระเบียบเพื่อให้ค้นหาและรวมข้อมูลง่ายขึ้น
- **Insertion Sort**: เข้าใจง่าย เหมาะกับข้อมูลเล็กหรือเกือบเรียงแล้ว
- **Merge Sort**: เสถียรและคาดเดาได้ ใช้ divide and conquer
- **Quick Sort**: เร็วมากโดยเฉลี่ย แต่ worst case ต้องระวัง
- **Heap Sort / Priority Queue**: ดีเมื่อเราต้องหยิบค่ามากสุด/น้อยสุดซ้ำ ๆ

Note: Princeton Algorithms จัด sorting เป็นหัวข้อหลัก และครอบคลุม elementary sorts, mergesort, quicksort, priority queues และ sorting applications: https://algs4.cs.princeton.edu/home/

---

# Algorithm Design Patterns
- **Divide and Conquer**: แบ่งปัญหา แก้ทีละส่วน รวมคำตอบ
- **Greedy**: เลือกทางที่ดีที่สุด ณ ตอนนี้ เมื่อพิสูจน์ได้ว่าไม่พลาด global optimum
- **Dynamic Programming**: เก็บคำตอบย่อย ลดการคำนวณซ้ำ
- **Backtracking**: ทดลองทางเลือก ถ้าไปต่อไม่ได้ให้ย้อนกลับ
- **Graph Algorithms**: traversal, shortest path, minimum spanning tree, flow

Note: ใช้สไลด์นี้เป็นแผนที่ความคิด ไม่ต้องลงรายละเอียดทั้งหมด ให้ผู้ฟังเห็นว่า DS&A เป็นชุด pattern สำหรับออกแบบวิธีคิด.

---

# เลือกใช้ให้ถูกสถานการณ์
- ต้องเข้าถึงด้วยตำแหน่งบ่อย: **Array**
- ต้องค้นหาด้วย key บ่อย: **Hash Table**
- ต้องรักษาลำดับเรียงและค้นหาเร็ว: **Balanced Tree**
- ต้องประมวลความสัมพันธ์: **Graph**
- ต้องหยิบ priority สูงสุด/ต่ำสุดเสมอ: **Heap / Priority Queue**

> เริ่มจาก operation ที่เกิดบ่อยที่สุด แล้วค่อยเลือก data structure

Note: ย้ำว่าไม่มี data structure ที่ดีที่สุดในทุกสถานการณ์ มีแต่ trade-off ที่เหมาะกับ pattern ของ workload.

---

# Checklist เวลาเจอโจทย์
- ขนาดข้อมูลประมาณเท่าไร และจะโตเร็วแค่ไหน?
- operation หลักคือ read, insert, delete, search, sort หรือ traverse?
- ต้องการผลลัพธ์ exact, approximate, online, หรือ batch?
- memory สำคัญกว่า speed หรือ speed สำคัญกว่า memory?
- worst case รับได้ไหม หรือสนใจ average case เป็นหลัก?

Note: สไลด์นี้ช่วยเปลี่ยนจาก "จำสูตร" เป็น "ถามคำถามที่ถูกต้อง". เหมาะสำหรับใช้ก่อนลงมือออกแบบ implementation.

---

# แหล่งข้อมูลที่ใช้
- NIST Dictionary of Algorithms and Data Structures
- MIT OpenCourseWare: 6.006 Introduction to Algorithms
- Open Data Structures by Pat Morin
- Princeton Algorithms, 4th Edition booksite

Note: URLs: https://xlinux.nist.gov/dads/ , https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ , https://opendatastructures.org/ , https://algs4.cs.princeton.edu/home/

---

# Questions
## จาก "เขียนให้ทำงานได้" ไปสู่ "เขียนให้รับอนาคตได้"

Note: ปิดด้วยคำถามชวนคุย เช่น ถ้ามีข้อมูล 10 ล้านแถว จะเปลี่ยน data structure ตรงไหนก่อน?
