const csFundamentals = [
  // ─── Coding Questions (6) ────────────────────────────────────────────

  {
    id: "cs-001",
    type: "coding",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "core",
    title: "Two Sum",
    tags: ["hash-map", "arrays", "complement-lookup"],
    question:
      "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume each input has **exactly one solution**, and you may not use the same element twice. Return the answer in any order.\n\n**Example:**\n```\nnums = [2, 7, 11, 15], target = 9\n→ [0, 1]   # because nums[0] + nums[1] == 9\n```",
    hint: "Use a hash map to store each number's index as you iterate. For every element, check whether `target - num` already exists in the map.",
    starterCode: `def two_sum(nums, target):
    """
    Return indices of two numbers that add up to target.

    Args:
        nums: List[int] - array of integers
        target: int - target sum
    Returns:
        List[int] - two indices
    """
    # TODO: Implement using a hash map for O(n) time
    pass`,
    solution: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    explanation:
      "We iterate through the array once, storing each number and its index in a hash map. For each element, we compute the complement (`target - num`) and check if it already exists in the map. If it does, we have found the pair. This avoids the O(n^2) brute-force of checking every pair.",
    testCases: `# Test 1: Basic case
assert two_sum([2, 7, 11, 15], 9) == [0, 1]

# Test 2: Non-adjacent pair
assert two_sum([3, 2, 4], 6) == [1, 2]

# Test 3: Negative numbers
assert two_sum([-1, -2, -3, -4, -5], -8) == [2, 4]

# Test 4: Duplicates
assert two_sum([3, 3], 6) == [0, 1]`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },

  {
    id: "cs-002",
    type: "coding",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "standard",
    title: "Top K Frequent Elements",
    tags: ["heap", "bucket-sort", "hash-map", "frequency"],
    question:
      "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.\n\n**Example:**\n```\nnums = [1,1,1,2,2,3], k = 2\n→ [1, 2]\n```\n\nYour algorithm must be better than O(n log n) average time complexity.",
    hint: "Count frequencies with a hash map, then either use a min-heap of size k (O(n log k)) or bucket sort by frequency (O(n)).",
    starterCode: `def top_k_frequent(nums, k):
    """
    Return the k most frequent elements.

    Args:
        nums: List[int] - array of integers
        k: int - number of top frequent elements to return
    Returns:
        List[int] - k most frequent elements
    """
    # TODO: Implement using bucket sort for O(n) time
    pass`,
    solution: `def top_k_frequent(nums, k):
    from collections import Counter

    freq = Counter(nums)

    # Bucket sort: index = frequency, value = list of nums with that freq
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)

    result = []
    for i in range(len(buckets) - 1, 0, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
    return result`,
    explanation:
      "First, count the frequency of each element with a hash map. Then use bucket sort: create an array of buckets where the index represents frequency. Place each number into the bucket matching its count. Finally, iterate from the highest bucket downward, collecting elements until we have k items. This yields O(n) time since the maximum frequency is at most n.",
    testCases: `# Test 1: Basic
assert sorted(top_k_frequent([1,1,1,2,2,3], 2)) == [1, 2]

# Test 2: Single element
assert top_k_frequent([1], 1) == [1]

# Test 3: All same frequency
result = top_k_frequent([1,2,3,4], 2)
assert len(result) == 2 and all(x in [1,2,3,4] for x in result)

# Test 4: Larger input
assert sorted(top_k_frequent([4,1,-1,2,-1,2,3], 2)) == [-1, 2]`,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },

  {
    id: "cs-003",
    type: "coding",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "standard",
    title: "LRU Cache",
    tags: ["linked-list", "hash-map", "cache", "design"],
    question:
      "Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(capacity)` — initialize the cache with positive capacity.\n- `get(key)` — return the value if the key exists, otherwise return -1.\n- `put(key, value)` — update the value if the key exists, otherwise add the key-value pair. If the number of keys exceeds the capacity, evict the **least recently used** key.\n\nBoth `get` and `put` must run in **O(1)** average time.",
    hint: "Combine a hash map (for O(1) lookup) with a doubly linked list (for O(1) insertion/removal). The list tracks access order — most recent at the head, least recent at the tail.",
    starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        """
        Initialize cache with given capacity.
        """
        # TODO: Set up hash map and doubly linked list
        pass

    def get(self, key: int) -> int:
        """
        Return value for key, or -1 if not found.
        Move accessed node to head (most recent).
        """
        # TODO: Implement O(1) get
        pass

    def put(self, key: int, value: int) -> None:
        """
        Insert or update key-value pair.
        Evict LRU entry if over capacity.
        """
        # TODO: Implement O(1) put
        pass`,
    solution: `class Node:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # key -> Node
        # Dummy head and tail for easy boundary handling
        self.head = Node()
        self.tail = Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        node = self.cache[key]
        self._remove(node)
        self._add_to_front(node)
        return node.val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self.cache[key] = node
        self._add_to_front(node)
        if len(self.cache) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
    explanation:
      "The LRU cache uses a doubly linked list to maintain access order and a hash map for O(1) key lookup. Sentinel head/tail nodes eliminate edge-case checks. On `get`, the node is moved to the front. On `put`, a new node is added to the front; if capacity is exceeded, the node just before the tail (least recently used) is evicted. Both operations are O(1).",
    testCases: `# Test: LeetCode example
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
assert cache.get(1) == 1      # returns 1, key 1 is now most recent
cache.put(3, 3)                # evicts key 2 (LRU)
assert cache.get(2) == -1      # key 2 was evicted
cache.put(4, 4)                # evicts key 1
assert cache.get(1) == -1
assert cache.get(3) == 3
assert cache.get(4) == 4`,
    timeComplexity: "O(1) per get/put",
    spaceComplexity: "O(capacity)",
  },

  {
    id: "cs-004",
    type: "coding",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "standard",
    title: "Merge K Sorted Lists",
    tags: ["heap", "linked-list", "merge", "priority-queue"],
    question:
      "You are given an array of `k` sorted linked lists. Merge all the linked lists into one sorted linked list and return it.\n\n**Example:**\n```\nInput:  [[1,4,5], [1,3,4], [2,6]]\nOutput: [1,1,2,3,4,4,5,6]\n```\n\nImplement using a min-heap for optimal efficiency.",
    hint: "Push the head of each list into a min-heap. Repeatedly extract the minimum, append it to the result, and push its next node (if any) back into the heap.",
    starterCode: `import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists):
    """
    Merge k sorted linked lists into one sorted list.

    Args:
        lists: List[ListNode] - array of sorted linked list heads
    Returns:
        ListNode - head of merged sorted linked list
    """
    # TODO: Use a min-heap to efficiently merge
    pass`,
    solution: `import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists):
    heap = []
    # Use a counter as tiebreaker so ListNode is never compared
    counter = 0
    for head in lists:
        if head:
            heapq.heappush(heap, (head.val, counter, head))
            counter += 1

    dummy = ListNode()
    current = dummy

    while heap:
        val, _, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        if node.next:
            counter += 1
            heapq.heappush(heap, (node.next.val, counter, node.next))

    return dummy.next`,
    explanation:
      "We maintain a min-heap of size at most k (one node per list). Initially, push the head of every non-empty list. At each step, pop the smallest node, attach it to the result, and push its successor. The counter acts as a tiebreaker so Python never compares ListNode objects directly. Total work: O(n log k) where n is the total number of nodes.",
    testCases: `# Helper to build / read linked lists
def build(arr):
    dummy = ListNode()
    cur = dummy
    for v in arr:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

# Test 1
result = merge_k_lists([build([1,4,5]), build([1,3,4]), build([2,6])])
assert to_list(result) == [1,1,2,3,4,4,5,6]

# Test 2: Empty lists
assert merge_k_lists([]) is None

# Test 3: Single list
assert to_list(merge_k_lists([build([0,2,5])])) == [0,2,5]`,
    timeComplexity: "O(n log k) where n = total nodes, k = number of lists",
    spaceComplexity: "O(k)",
  },

  {
    id: "cs-005",
    type: "coding",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "standard",
    title: "Course Schedule (Topological Sort)",
    tags: ["graph", "topological-sort", "BFS", "DFS", "cycle-detection"],
    question:
      "There are `numCourses` courses labeled `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`.\n\nReturn `true` if you can finish all courses (i.e., the prerequisite graph has no cycle), otherwise `false`.\n\n**Example:**\n```\nnumCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]\n→ True   # one valid order: 0,1,2,3\n\nnumCourses = 2, prerequisites = [[1,0],[0,1]]\n→ False  # cycle between 0 and 1\n```",
    hint: "Use Kahn's algorithm (BFS topological sort): compute in-degrees, start with nodes of in-degree 0, and peel them off layer by layer. If the count of processed nodes equals numCourses, there is no cycle.",
    starterCode: `from collections import deque, defaultdict

def can_finish(numCourses, prerequisites):
    """
    Determine if all courses can be finished (no cycle in prerequisite graph).

    Args:
        numCourses: int - total number of courses
        prerequisites: List[List[int]] - prerequisite pairs [course, prereq]
    Returns:
        bool - True if all courses can be completed
    """
    # TODO: Implement using BFS topological sort (Kahn's algorithm)
    pass`,
    solution: `from collections import deque, defaultdict

def can_finish(numCourses, prerequisites):
    graph = defaultdict(list)
    in_degree = [0] * numCourses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        in_degree[course] += 1

    queue = deque()
    for i in range(numCourses):
        if in_degree[i] == 0:
            queue.append(i)

    processed = 0
    while queue:
        node = queue.popleft()
        processed += 1
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return processed == numCourses`,
    explanation:
      "Kahn's algorithm performs a BFS-based topological sort. First, build an adjacency list and compute in-degrees. Enqueue all nodes with in-degree 0 (no prerequisites). Process each node: decrement the in-degree of its neighbors, enqueueing any that reach 0. If we process all nodes, the graph is a DAG. If not, a cycle exists — some nodes' in-degrees never reached 0.",
    testCases: `# Test 1: Valid ordering exists
assert can_finish(4, [[1,0],[2,0],[3,1],[3,2]]) == True

# Test 2: Cycle
assert can_finish(2, [[1,0],[0,1]]) == False

# Test 3: No prerequisites
assert can_finish(3, []) == True

# Test 4: Chain
assert can_finish(3, [[1,0],[2,1]]) == True

# Test 5: Self-loop
assert can_finish(1, [[0,0]]) == False`,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
  },

  {
    id: "cs-006",
    type: "coding",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "core",
    title: "Number of Islands",
    tags: ["BFS", "DFS", "grid", "graph-traversal", "connected-components"],
    question:
      'Given an `m x n` 2D grid of `\'1\'`s (land) and `\'0\'`s (water), return the **number of islands**. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n**Example:**\n```\ngrid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]\n→ 3\n```',
    hint: "Iterate through the grid. When you find a '1', increment the island count and use BFS or DFS to mark all connected '1's as visited (e.g., change them to '0').",
    starterCode: `from collections import deque

def num_islands(grid):
    """
    Count the number of islands in a 2D grid.

    Args:
        grid: List[List[str]] - 2D grid of '1' (land) and '0' (water)
    Returns:
        int - number of islands
    """
    # TODO: Implement using BFS or DFS
    pass`,
    solution: `from collections import deque

def num_islands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'
        while queue:
            row, col = queue.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = row + dr, col + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                    grid[nr][nc] = '0'
                    queue.append((nr, nc))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                bfs(r, c)

    return count`,
    explanation:
      "Scan every cell. When an unvisited land cell ('1') is found, increment the island counter and flood-fill (BFS) to mark all connected land cells as visited by setting them to '0'. Each cell is visited at most once, giving O(m*n) time. BFS is preferred over DFS for large grids to avoid stack overflow.",
    testCases: `# Test 1: Three islands
grid1 = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
assert num_islands(grid1) == 3

# Test 2: One island
grid2 = [["1","1"],["1","1"]]
assert num_islands(grid2) == 1

# Test 3: No islands
grid3 = [["0","0"],["0","0"]]
assert num_islands(grid3) == 0

# Test 4: All separate
grid4 = [["1","0","1"],["0","1","0"],["1","0","1"]]
assert num_islands(grid4) == 5`,
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n) worst case for BFS queue",
  },

  // ─── Knowledge Questions (2) ─────────────────────────────────────────

  {
    id: "cs-007",
    type: "knowledge",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "core",
    title: "Hash Table Complexity",
    tags: ["hash-table", "time-complexity", "collision-resolution"],
    question:
      "What is the **average-case** and **worst-case** time complexity for search, insert, and delete in a hash table? What causes worst-case degradation, and name two common collision resolution strategies.",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "Average O(1) for all ops; worst case O(n). Worst case occurs when all keys hash to the same bucket. Strategies: chaining and open addressing (linear probing).",
      },
      {
        id: "B",
        text: "Average O(log n) for all ops; worst case O(n). Worst case occurs due to re-hashing. Strategies: chaining and quadratic probing.",
      },
      {
        id: "C",
        text: "Average O(1) for all ops; worst case O(log n). Worst case occurs with poor hash functions. Strategies: separate chaining and cuckoo hashing.",
      },
      {
        id: "D",
        text: "Average O(1) for search/insert, O(n) for delete; worst case O(n) for all. Worst case occurs with high load factor. Strategies: robin hood hashing and hopscotch hashing.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "A well-designed hash table provides O(1) average time for search, insert, and delete. The worst case is O(n) — it occurs when many keys collide into the same bucket (e.g., a degenerate hash function or adversarial input). The two most common collision resolution strategies are:\n\n1. **Chaining (separate chaining):** Each bucket stores a linked list (or other collection) of entries that hash to the same index.\n2. **Open addressing (e.g., linear probing):** On collision, probe subsequent slots in the array until an empty one is found.\n\nModern languages like Python use open addressing with perturbation; Java's HashMap uses chaining (with tree-ification at high bucket depth).",
  },

  {
    id: "cs-008",
    type: "knowledge",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "standard",
    title: "Distributed Systems Failure Modes",
    tags: ["distributed-systems", "CAP-theorem", "fault-tolerance"],
    question:
      "Explain the difference between **network partitions** and **Byzantine faults** in distributed systems. How does the CAP theorem relate to network partitions, and why are Byzantine faults harder to handle?",
    format: "short-answer",
    options: null,
    correctAnswer:
      "A network partition occurs when nodes in a distributed system cannot communicate with each other due to network failures, effectively splitting the cluster into isolated groups. The CAP theorem states that during a partition, a system must choose between consistency (all nodes see the same data) and availability (every request gets a response). Byzantine faults are more severe: a faulty node may behave arbitrarily — sending conflicting information to different peers, lying, or acting maliciously. Byzantine fault tolerance (BFT) requires at least 3f+1 nodes to tolerate f faulty nodes, whereas crash fault tolerance only needs 2f+1. Byzantine faults are harder because you cannot trust the messages from faulty nodes, requiring cryptographic proofs or multi-round consensus protocols like PBFT.",
    explanation:
      "**Network partitions** are a communication failure — nodes are healthy but cannot reach each other. The CAP theorem (Brewer, 2000) proves that no distributed system can simultaneously guarantee Consistency, Availability, and Partition tolerance; during a partition you must sacrifice C or A.\n\n**Byzantine faults** (Lamport et al., 1982) are a behavioral failure — nodes may act arbitrarily, including sending contradictory messages. This is strictly harder than crash failures because:\n- You cannot distinguish a slow node from a malicious one.\n- A Byzantine node may equivocate (send different values to different peers).\n- Tolerance requires 3f+1 total nodes for f faults (vs. 2f+1 for crash faults).\n\nPractical systems like Raft/Paxos handle crash faults and partitions. Blockchain consensus (e.g., PBFT, Tendermint) handles Byzantine faults at the cost of higher message complexity — O(n^2) vs O(n).",
  },

  // ─── Open-Ended Questions (2) ────────────────────────────────────────

  {
    id: "cs-009",
    type: "open-ended",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "standard",
    title: "Rolling Unique Users Algorithm",
    tags: ["sliding-window", "algorithm-design", "probabilistic-data-structures"],
    question:
      "Design an algorithm to count the number of **unique users** who visited a website in any given **rolling 24-hour window**. The system receives a stream of `(timestamp, user_id)` events. Discuss exact and approximate approaches, and analyze the trade-offs.",
    context:
      "This is a common problem at scale — exact counting becomes prohibitively expensive when cardinality is high (e.g., billions of user IDs). Interviewers want to see you reason about the trade-off between accuracy, memory, and latency. Consider data structures like hash sets, sorted structures, and probabilistic sketches.",
    rubric: [
      "Describes a correct exact solution (e.g., hash set + time-ordered eviction queue)",
      "Analyzes the memory cost of the exact approach (O(n) where n = unique users in window)",
      "Proposes an approximate solution (e.g., HyperLogLog or sliding-window HLL)",
      "Explains the accuracy-memory trade-off (HLL uses O(log log n) memory with ~2% error)",
      "Discusses how to handle window expiry (e.g., bucketed HLL, DGIM, or time-bucketed rotation)",
      "Addresses scalability: sharding, distributed counting, or mergeability of sketches",
    ],
    sampleAnswer:
      "**Exact approach:** Maintain a hash set of user IDs seen in the current window and a deque of `(timestamp, user_id)` events sorted by time. On each new event, evict entries from the front of the deque whose timestamps are older than 24 hours and remove them from the hash set (only if no newer occurrence exists — use a count map). The unique count is `len(hash_set)`. This is O(1) amortized per event but costs O(n) memory for n unique users.\n\n**Approximate approach:** Use HyperLogLog (HLL), which estimates cardinality using O(m) memory (e.g., 12 KB for m=16384 registers) with ~1.04/sqrt(m) standard error (~0.8%). For a sliding window, divide time into sub-buckets (e.g., 1-hour intervals). Maintain 24 HLL sketches; each hour, expire the oldest and merge the remaining 23 + current into a query-time estimate. HLL supports merge natively, making this composable across distributed nodes.\n\n**Trade-offs:**\n- Exact: O(n) memory, zero error, harder to distribute\n- HLL: ~12 KB fixed memory, ~2% error, trivially mergeable across shards\n- For most production systems (e.g., analytics dashboards), the approximate approach is preferred.",
    keyPoints: [
      "Exact solution with hash set + time-ordered eviction",
      "Memory analysis: exact is O(unique users), which can be billions",
      "HyperLogLog as the standard approximate cardinality estimator",
      "Sliding window via time-bucketed HLL sketches with periodic rotation",
      "HLL mergeability enables distributed counting across shards",
      "Practical recommendation depends on accuracy requirements",
    ],
  },

  {
    id: "cs-010",
    type: "open-ended",
    category: "cs-fundamentals",
    categoryLabel: "CS Fundamentals",
    difficulty: "stretch",
    title: "Streaming Service with Exactly-Once Semantics",
    tags: ["distributed-systems", "streaming", "exactly-once", "idempotency"],
    question:
      "You are designing a real-time event streaming service (similar to Kafka) that must provide **exactly-once delivery semantics** to consumers. Explain the fundamental challenges, and describe a design that achieves exactly-once processing end-to-end.",
    context:
      "Exactly-once semantics is one of the hardest problems in distributed systems. Many candidates confuse delivery guarantees (at-most-once, at-least-once, exactly-once) or believe exactly-once is impossible. Interviewers look for practical understanding of how systems like Kafka, Flink, and TiDB achieve effective exactly-once through idempotency and transactional protocols.",
    rubric: [
      "Correctly distinguishes at-most-once, at-least-once, and exactly-once semantics",
      "Explains why true exactly-once delivery is impossible (Two Generals Problem) and how systems achieve effectively-exactly-once via idempotent processing",
      "Describes producer-side deduplication (idempotent producers with sequence numbers)",
      "Describes consumer-side strategy (transactional offset commits + processing in one atomic operation)",
      "Discusses end-to-end exactly-once: source → broker → sink all coordinated",
      "Mentions real-world systems or protocols (Kafka transactions, Flink checkpointing, 2PC)",
    ],
    sampleAnswer:
      "**The fundamental challenge:** The Two Generals Problem proves that no protocol can guarantee exactly-once delivery over an unreliable network. A producer cannot know if a message it sent was persisted if the ACK is lost. Therefore, practical systems achieve *effectively exactly-once* by combining at-least-once delivery with idempotent processing.\n\n**Producer side — Idempotent Producers:** Assign each producer a unique PID and a monotonically increasing sequence number per partition. The broker deduplicates by rejecting messages with sequence numbers it has already seen. This makes retries safe.\n\n**Broker side — Transactional Writes:** Support atomic multi-partition writes using a transaction coordinator. The producer begins a transaction, writes to multiple partitions, and commits atomically. Under the hood, this uses a 2PC-like protocol with a transaction log. Aborted transactions are invisible to consumers reading at `read_committed` isolation.\n\n**Consumer side — Atomic Read-Process-Write:** The consumer reads messages, processes them, and writes results + updated offsets in a single atomic transaction. Kafka achieves this by allowing consumers to commit offsets and produce output records in one transaction. If the consumer crashes, the uncommitted transaction is aborted, and reprocessing starts from the last committed offset — but since the output was also rolled back, no duplicates appear downstream.\n\n**End-to-end:** True end-to-end exactly-once requires the external sink to support idempotent writes (e.g., upserts keyed on a deterministic ID) or participate in the transaction (e.g., two-phase commit with a database). Systems like Apache Flink achieve this with distributed snapshots (Chandy-Lamport) and aligned checkpointing.\n\n**Cost:** Exactly-once adds latency (transaction commit overhead), reduces throughput (smaller batches), and increases complexity. Many systems accept at-least-once with application-level deduplication as a pragmatic alternative.",
    keyPoints: [
      "True exactly-once delivery is impossible; systems achieve effectively-exactly-once",
      "Idempotent producers with PIDs and sequence numbers prevent duplicate writes",
      "Transactional writes enable atomic multi-partition produces",
      "Consumers atomically commit offsets and output in a single transaction",
      "External sinks need idempotent writes or 2PC participation for end-to-end guarantees",
      "Trade-off: exactly-once adds latency and complexity vs. at-least-once + dedup",
    ],
  },
];

export default csFundamentals;
