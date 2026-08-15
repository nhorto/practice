const pytorchBasics = [
  // ─── Coding Questions ────────────────────────────────────────────────────

  {
    id: "ptbasics-001",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Tensor Creation and dtypes",
    tags: ["tensors", "dtype", "numpy", "shape", "device"],
    question:
      "PyTorch tensors are the foundation of everything — they hold your data, weights, and gradients. Complete the exercises below to practice creating tensors from different sources and inspecting their properties.\n\n**Tasks:**\n1. Create a 1D tensor from a Python list of integers `[1, 2, 3, 4, 5]` with dtype `torch.float32`\n2. Create a 2D tensor of zeros with shape `(3, 4)` and dtype `torch.int64`\n3. Convert a NumPy array to a PyTorch tensor (use `np.array([1.0, 2.0, 3.0])`)\n4. Create a random tensor with shape `(2, 3)` using `torch.randn`\n5. Return a dict with keys `shape`, `dtype`, `device` for the random tensor\n\n**Example:**\n```\ntensor_from_list → tensor([1., 2., 3., 4., 5.])\nzeros_tensor shape → torch.Size([3, 4])\n```",
    hint: "Use `torch.tensor(data, dtype=...)` for creating from lists. `torch.from_numpy()` bridges NumPy and PyTorch. Access `.shape`, `.dtype`, and `.device` as tensor attributes — no parentheses needed, they are properties not methods.",
    starterCode: `import torch
import numpy as np

def tensor_creation_exercises():
    """
    Practice creating tensors from different sources.
    Returns a tuple of (tensor_from_list, zeros_tensor, from_numpy, random_tensor, info_dict)
    """
    # TODO: 1. Create 1D float32 tensor from [1, 2, 3, 4, 5]
    tensor_from_list = None

    # TODO: 2. Create 2D int64 zeros tensor with shape (3, 4)
    zeros_tensor = None

    # TODO: 3. Convert np.array([1.0, 2.0, 3.0]) to a PyTorch tensor
    numpy_arr = np.array([1.0, 2.0, 3.0])
    from_numpy = None

    # TODO: 4. Create a random (2, 3) tensor using torch.randn
    random_tensor = None

    # TODO: 5. Build info dict with shape, dtype, device of random_tensor
    info_dict = {}

    return tensor_from_list, zeros_tensor, from_numpy, random_tensor, info_dict`,
    solution: `import torch
import numpy as np

def tensor_creation_exercises():
    # 1. Float32 tensor from list
    tensor_from_list = torch.tensor([1, 2, 3, 4, 5], dtype=torch.float32)

    # 2. Int64 zeros tensor
    zeros_tensor = torch.zeros((3, 4), dtype=torch.int64)

    # 3. Convert NumPy array — from_numpy shares memory with the array
    numpy_arr = np.array([1.0, 2.0, 3.0])
    from_numpy = torch.from_numpy(numpy_arr)

    # 4. Random normal tensor
    random_tensor = torch.randn(2, 3)

    # 5. Inspect shape, dtype, device (these are properties, not methods)
    info_dict = {
        "shape": random_tensor.shape,   # torch.Size([2, 3])
        "dtype": random_tensor.dtype,   # torch.float32
        "device": random_tensor.device, # device(type='cpu')
    }

    return tensor_from_list, zeros_tensor, from_numpy, random_tensor, info_dict`,
    explanation:
      "`torch.tensor()` copies data and lets you specify dtype explicitly. `torch.from_numpy()` creates a tensor that *shares memory* with the NumPy array — modifying one modifies the other. `torch.zeros()`, `torch.ones()`, and `torch.randn()` are factory functions that create tensors directly. The `.shape`, `.dtype`, and `.device` properties are essential for debugging — always check them when you get unexpected results.",
    testCases: `t_list, t_zeros, t_np, t_rand, info = tensor_creation_exercises()

# Test 1: float32 from list
assert t_list.dtype == torch.float32
assert t_list.shape == torch.Size([5])
assert list(t_list.numpy()) == [1.0, 2.0, 3.0, 4.0, 5.0]

# Test 2: int64 zeros
assert t_zeros.dtype == torch.int64
assert t_zeros.shape == torch.Size([3, 4])
assert t_zeros.sum().item() == 0

# Test 3: from numpy
assert t_np.shape == torch.Size([3])
assert t_np[1].item() == 2.0

# Test 4: random tensor shape
assert t_rand.shape == torch.Size([2, 3])

# Test 5: info dict keys and types
assert "shape" in info and "dtype" in info and "device" in info
assert info["shape"] == torch.Size([2, 3])`,
    timeComplexity: "O(n) where n is the number of elements",
    spaceComplexity: "O(n)",
  },

  {
    id: "ptbasics-002",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Tensor Indexing and Slicing",
    tags: ["indexing", "slicing", "boolean-mask", "fancy-indexing"],
    question:
      "Indexing in PyTorch works like NumPy but also supports GPU tensors. Practice the main indexing patterns on the tensor `x = torch.arange(24).reshape(4, 6)`.\n\n**Tasks (all operate on the same base tensor):**\n1. Extract the element at row 2, column 3 (0-indexed) as a Python int\n2. Extract the entire second row (index 1) as a 1D tensor\n3. Extract rows 1 through 2 (inclusive) and columns 2 through 4 (inclusive) as a 2D slice\n4. Use a boolean mask to extract all elements greater than 10 (returns a 1D tensor)\n5. Use fancy indexing to extract rows at indices `[0, 3]`\n\n**Example:**\n```\nx:\ntensor([[ 0,  1,  2,  3,  4,  5],\n        [ 6,  7,  8,  9, 10, 11],\n        [12, 13, 14, 15, 16, 17],\n        [18, 19, 20, 21, 22, 23]])\n\nelement at (2, 3) → 15\n```",
    hint: "Use `x[row, col]` for single elements, `x[row]` for a whole row, `x[1:3, 2:5]` for a slice. Boolean masks: `x[x > 10]` returns all matching elements as a flat tensor. Fancy indexing: `x[[0, 3]]` selects specific rows.",
    starterCode: `import torch

def indexing_exercises():
    """
    Practice tensor indexing on a (4, 6) tensor.
    Returns: (element, row, slice_2d, masked, fancy)
    """
    x = torch.arange(24).reshape(4, 6)

    # TODO: 1. Extract element at (row=2, col=3) as a Python int
    element = None

    # TODO: 2. Extract entire second row (index 1)
    row = None

    # TODO: 3. Rows 1-2, columns 2-4 (all inclusive, 2D slice)
    slice_2d = None

    # TODO: 4. All elements greater than 10 (boolean mask)
    masked = None

    # TODO: 5. Rows at indices [0, 3] (fancy indexing)
    fancy = None

    return element, row, slice_2d, masked, fancy`,
    solution: `import torch

def indexing_exercises():
    x = torch.arange(24).reshape(4, 6)

    # 1. Single element — .item() converts 0-dim tensor to Python scalar
    element = x[2, 3].item()  # → 15

    # 2. Entire second row — colon means "all columns"
    row = x[1]  # or x[1, :]

    # 3. Slice: rows 1:3 (exclusive end), cols 2:5 (exclusive end)
    slice_2d = x[1:3, 2:5]

    # 4. Boolean mask — creates a flat tensor of matching values
    masked = x[x > 10]

    # 5. Fancy indexing — pass a list of row indices
    fancy = x[[0, 3]]

    return element, row, slice_2d, masked, fancy`,
    explanation:
      "PyTorch uses the same indexing syntax as NumPy. Single-element access with `x[i, j]` returns a 0-dimensional tensor; call `.item()` to get a Python scalar. Slicing with `start:stop` uses exclusive end indices (like Python ranges). Boolean masks produce flat tensors of all matching values. Fancy indexing (passing a list of indices) selects specific rows or columns. All these operations return *views* when possible — they share memory with the original tensor, so modifying a slice modifies the original.",
    testCases: `element, row, slice_2d, masked, fancy = indexing_exercises()

# Test 1: element at (2, 3) = 15
assert element == 15
assert isinstance(element, int)

# Test 2: second row [6, 7, 8, 9, 10, 11]
assert list(row.numpy()) == [6, 7, 8, 9, 10, 11]

# Test 3: slice shape and values
assert slice_2d.shape == torch.Size([2, 3])
assert slice_2d[0, 0].item() == 8   # row 1, col 2

# Test 4: boolean mask — values 11 through 23
assert masked.shape == torch.Size([13])
assert masked[0].item() == 11
assert masked[-1].item() == 23

# Test 5: fancy indexing selects rows 0 and 3
assert fancy.shape == torch.Size([2, 6])
assert list(fancy[0].numpy()) == [0, 1, 2, 3, 4, 5]
assert list(fancy[1].numpy()) == [18, 19, 20, 21, 22, 23]`,
    timeComplexity: "O(1) for view-based ops; O(k) for boolean/fancy indexing with k results",
    spaceComplexity: "O(1) for views; O(k) for boolean/fancy results",
  },

  {
    id: "ptbasics-003",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Reshape, View, Permute, Squeeze",
    tags: ["reshape", "view", "permute", "squeeze", "unsqueeze", "contiguous"],
    question:
      "Understanding tensor shape manipulation is critical — shape errors are the most common PyTorch bug. Practice the key operations below.\n\n**Tasks (start with `x = torch.arange(12)`):**\n1. Use `.view(3, 4)` to reshape x into a (3, 4) tensor\n2. Use `.reshape(2, 2, 3)` to reshape x into a (2, 2, 3) tensor\n3. Permute a (3, 4) tensor to shape (4, 3) using `.permute()`\n4. After permuting, call `.contiguous().reshape(12)` to flatten it\n5. Add a new dimension at position 0 using `unsqueeze`, then remove it with `squeeze`\n\n**Key concept:**\n- `.view()` requires contiguous memory — fails after ops like `.permute()`\n- `.reshape()` works even on non-contiguous tensors (may copy)\n- `.permute()` reorders dimensions; result is usually non-contiguous",
    hint: "After `.permute()`, the tensor is non-contiguous (its memory layout doesn't match its shape). You must call `.contiguous()` before `.view()`, or use `.reshape()` which handles this automatically. Use `tensor.is_contiguous()` to check.",
    starterCode: `import torch

def shape_manipulation():
    """
    Practice reshape, view, permute, squeeze.
    Returns: (viewed, reshaped, permuted, flattened, squeezed_result)
    """
    x = torch.arange(12)

    # TODO: 1. Reshape to (3, 4) using .view()
    viewed = None

    # TODO: 2. Reshape to (2, 2, 3) using .reshape()
    reshaped = None

    # TODO: 3. Create a (3, 4) tensor and permute to (4, 3)
    mat = torch.arange(12).reshape(3, 4)
    permuted = None

    # TODO: 4. Flatten permuted to 1D using .contiguous().reshape(-1)
    #          (Use -1 as a wildcard meaning "infer this dimension")
    flattened = None

    # TODO: 5. unsqueeze at dim=0, then squeeze it back off
    base = torch.tensor([1.0, 2.0, 3.0])
    expanded = None   # shape (1, 3) after unsqueeze
    squeezed_result = None  # shape (3,) after squeeze

    return viewed, reshaped, permuted, flattened, expanded, squeezed_result`,
    solution: `import torch

def shape_manipulation():
    x = torch.arange(12)

    # 1. .view() is fastest — works only on contiguous tensors
    viewed = x.view(3, 4)

    # 2. .reshape() is safer — handles non-contiguous internally
    reshaped = x.reshape(2, 2, 3)

    # 3. .permute() reorders axes — like numpy.transpose for N dims
    mat = torch.arange(12).reshape(3, 4)
    permuted = mat.permute(1, 0)  # swap axes 0 and 1 → (4, 3)

    # 4. permuted is non-contiguous; contiguous() copies to fix memory layout
    #    -1 tells PyTorch to infer the size of that dimension
    flattened = permuted.contiguous().reshape(-1)

    # 5. unsqueeze adds a size-1 dimension; squeeze removes all size-1 dims
    base = torch.tensor([1.0, 2.0, 3.0])
    expanded = base.unsqueeze(0)      # (3,) → (1, 3)
    squeezed_result = expanded.squeeze()  # (1, 3) → (3,)

    return viewed, reshaped, permuted, flattened, expanded, squeezed_result`,
    explanation:
      "`.view()` and `.reshape()` both change the shape without altering data, but `.view()` requires the tensor to be contiguous in memory. Operations like `.permute()`, `.transpose()`, and some slices create *non-contiguous* tensors — the logical shape doesn't match the physical memory layout. `.reshape()` automatically calls `.contiguous()` internally if needed (may copy). Use `.unsqueeze(dim)` to add dimensions (useful for batch dims) and `.squeeze()` to remove size-1 dimensions. The `-1` wildcard in reshape means 'infer this dimension from the total size'.",
    testCases: `viewed, reshaped, permuted, flattened, expanded, squeezed_result = shape_manipulation()

# Test 1: view shape
assert viewed.shape == torch.Size([3, 4])

# Test 2: reshape shape
assert reshaped.shape == torch.Size([2, 2, 3])

# Test 3: permuted shape and non-contiguous
assert permuted.shape == torch.Size([4, 3])
assert not permuted.is_contiguous()

# Test 4: flattened is 1D with 12 elements
assert flattened.shape == torch.Size([12])
assert flattened.is_contiguous()

# Test 5: unsqueeze/squeeze
assert expanded.shape == torch.Size([1, 3])
assert squeezed_result.shape == torch.Size([3])`,
    timeComplexity: "O(1) for view/reshape (no copy); O(n) when contiguous() copies",
    spaceComplexity: "O(1) for views; O(n) when a copy is made",
  },

  {
    id: "ptbasics-004",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Basic Tensor Operations",
    tags: ["element-wise", "matmul", "broadcasting", "in-place", "operations"],
    question:
      "PyTorch overloads standard Python operators for tensors. Practice the core arithmetic operations below.\n\n**Tasks:**\n1. Element-wise add two tensors `a` and `b` (both shape `(3,)`)\n2. Element-wise multiply them\n3. Matrix multiply two 2D tensors: `A` (shape `(2, 3)`) and `B` (shape `(3, 4)`) — result is `(2, 4)`\n4. Demonstrate broadcasting: add a `(3,)` vector to a `(2, 3)` matrix\n5. Use an in-place operation to add 10 to tensor `a` using the `add_()` method\n\n**Broadcasting rule:** PyTorch aligns shapes from the right and expands dimensions of size 1 (or missing dimensions) automatically.\n\n```\n# Broadcasting example:\na = torch.ones(2, 3)   # shape (2, 3)\nb = torch.tensor([1., 2., 3.])  # shape (3,) → treated as (1, 3)\na + b  # → shape (2, 3): b is added to each row\n```",
    hint: "Use `+` and `*` for element-wise ops. Use `@` or `torch.matmul()` for matrix multiplication. In-place operations have a trailing underscore: `add_()`, `mul_()`, `fill_()`. Be careful with in-place ops on tensors that require gradients — they can break autograd.",
    starterCode: `import torch

def tensor_operations():
    """
    Practice basic tensor operations.
    Returns: (elem_add, elem_mul, matmul_result, broadcast_result, a_after_inplace)
    """
    a = torch.tensor([1.0, 2.0, 3.0])
    b = torch.tensor([4.0, 5.0, 6.0])
    A = torch.ones(2, 3)
    B = torch.ones(3, 4) * 2

    # TODO: 1. Element-wise addition of a and b
    elem_add = None

    # TODO: 2. Element-wise multiplication of a and b
    elem_mul = None

    # TODO: 3. Matrix multiply A @ B
    matmul_result = None

    # TODO: 4. Broadcast: add a (shape 3,) vector to A (shape 2,3)
    row_vec = torch.tensor([10.0, 20.0, 30.0])
    broadcast_result = None

    # TODO: 5. In-place add 10 to tensor a using add_()
    a.add_(10)
    a_after_inplace = a

    return elem_add, elem_mul, matmul_result, broadcast_result, a_after_inplace`,
    solution: `import torch

def tensor_operations():
    a = torch.tensor([1.0, 2.0, 3.0])
    b = torch.tensor([4.0, 5.0, 6.0])
    A = torch.ones(2, 3)
    B = torch.ones(3, 4) * 2

    # 1. Element-wise addition — same as torch.add(a, b)
    elem_add = a + b

    # 2. Element-wise multiplication — same as torch.mul(a, b)
    elem_mul = a * b

    # 3. Matrix multiplication: (2,3) @ (3,4) → (2,4)
    matmul_result = A @ B  # equivalent to torch.matmul(A, B)

    # 4. Broadcasting: (3,) is treated as (1,3), broadcast across rows of A
    row_vec = torch.tensor([10.0, 20.0, 30.0])
    broadcast_result = A + row_vec  # each row of A gets row_vec added

    # 5. In-place add — modifies a in memory, no new tensor created
    a.add_(10)  # equivalent to a += 10
    a_after_inplace = a

    return elem_add, elem_mul, matmul_result, broadcast_result, a_after_inplace`,
    explanation:
      "PyTorch operators (`+`, `*`, `@`) call the underlying torch functions. The `@` operator calls `torch.matmul()` and is preferred for readability. Broadcasting follows NumPy rules: align shapes from the right, expand size-1 or missing dimensions. In-place operations (trailing `_`) modify the tensor in place and return `self` — they save memory but cannot be used on tensors that are intermediate nodes in a computation graph because they destroy the original values needed for gradient computation.",
    testCases: `elem_add, elem_mul, matmul_result, broadcast_result, a_inplace = tensor_operations()

# Test 1: element-wise add
assert list(elem_add.numpy()) == [5.0, 7.0, 9.0]

# Test 2: element-wise multiply
assert list(elem_mul.numpy()) == [4.0, 10.0, 18.0]

# Test 3: matmul shape and values — ones(2,3) @ (ones(3,4)*2) = 6*ones(2,4)
assert matmul_result.shape == torch.Size([2, 4])
assert matmul_result[0, 0].item() == 6.0

# Test 4: broadcast result shape and values
assert broadcast_result.shape == torch.Size([2, 3])
assert broadcast_result[0, 1].item() == 21.0  # 1.0 + 20.0

# Test 5: in-place modified a to [11, 12, 13]
assert list(a_inplace.numpy()) == [11.0, 12.0, 13.0]`,
    timeComplexity: "O(n) element-wise; O(n*m*k) for matmul of (n,m)@(m,k)",
    spaceComplexity: "O(n) for new tensors; O(1) for in-place ops",
  },

  {
    id: "ptbasics-005",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Autograd Basics",
    tags: ["autograd", "requires_grad", "backward", "gradient", "detach", "no_grad"],
    question:
      "Autograd is PyTorch's automatic differentiation engine. It tracks all operations on tensors with `requires_grad=True` and computes gradients when `.backward()` is called.\n\n**Tasks:**\n1. Create a tensor `x = torch.tensor(3.0)` with `requires_grad=True`\n2. Compute `y = x**2 + 2*x + 1` (a simple polynomial)\n3. Call `.backward()` on y to compute dy/dx\n4. Read the gradient from `x.grad` and verify it equals `2*x + 2 = 8.0` at x=3\n5. Create a detached copy of x (no gradient tracking) using `.detach()`\n6. Show that inside `torch.no_grad()`, operations do not build a computation graph\n\n**Math:** If y = x^2 + 2x + 1, then dy/dx = 2x + 2. At x=3, dy/dx = 8.",
    hint: "After calling `y.backward()`, the gradient is stored in `x.grad`. Calling `.backward()` a second time accumulates gradients — use `x.grad.zero_()` to reset. `.detach()` returns a tensor that shares data but is removed from the computation graph. Wrap inference code in `torch.no_grad()` to save memory.",
    starterCode: `import torch

def autograd_basics():
    """
    Demonstrate autograd: compute d/dx(x^2 + 2x + 1) at x=3.
    Returns: (gradient_value, detached_tensor, graph_built_outside_no_grad)
    """
    # TODO: 1. Create x = 3.0 with gradient tracking enabled
    x = None

    # TODO: 2. Compute y = x^2 + 2x + 1
    y = None

    # TODO: 3. Call backward() to compute gradients
    # (no arguments needed for scalar outputs)

    # TODO: 4. Read the gradient — should be 8.0
    gradient_value = None

    # TODO: 5. Create a detached copy of x
    x_detached = None

    # TODO: 6. Inside torch.no_grad(), compute z = x_detached * 2
    #          Check that z.requires_grad is False
    with torch.no_grad():
        z = None
    graph_built_outside_no_grad = None  # Should be False

    return gradient_value, x_detached, graph_built_outside_no_grad`,
    solution: `import torch

def autograd_basics():
    # 1. requires_grad=True tells autograd to track this tensor
    x = torch.tensor(3.0, requires_grad=True)

    # 2. Build computation graph: y = x^2 + 2x + 1
    y = x**2 + 2*x + 1  # y = 9 + 6 + 1 = 16

    # 3. Backpropagate: computes dy/dx for all leaf tensors in the graph
    y.backward()

    # 4. x.grad now holds dy/dx = 2x + 2 = 2(3) + 2 = 8
    gradient_value = x.grad.item()  # → 8.0

    # 5. detach() returns a tensor with same data but no gradient tracking
    x_detached = x.detach()

    # 6. Operations inside no_grad() don't build a computation graph
    with torch.no_grad():
        z = x_detached * 2  # z is a plain tensor, no grad_fn
    graph_built_outside_no_grad = z.requires_grad  # False

    return gradient_value, x_detached, graph_built_outside_no_grad`,
    explanation:
      "PyTorch builds a dynamic computation graph as operations run. Each tensor records its `grad_fn` — the operation that created it. `.backward()` traverses this graph in reverse (backpropagation) using the chain rule to accumulate gradients in `.grad` of all leaf tensors with `requires_grad=True`. Key rules: (1) Only scalar outputs can call `.backward()` without arguments. (2) Gradients accumulate — always zero them before the next backward pass. (3) `.detach()` is used when you want to use a tensor's value but not track gradients through it. (4) `torch.no_grad()` is used during inference to skip building the graph entirely, saving memory and computation.",
    testCases: `grad_val, x_det, no_graph = autograd_basics()

# Test 1: gradient of x^2 + 2x + 1 at x=3 is 2(3)+2 = 8
assert grad_val == 8.0

# Test 2: detached tensor has same value but no gradient
assert x_det.item() == 3.0
assert not x_det.requires_grad

# Test 3: no_grad context produces tensors without grad tracking
assert no_graph == False`,
    timeComplexity: "O(n) for forward and backward passes (n = operations in graph)",
    spaceComplexity: "O(n) for storing the computation graph",
  },

  {
    id: "ptbasics-006",
    type: "knowledge",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Autograd Computation Graph",
    tags: ["autograd", "computation-graph", "backward", "retain_graph"],
    question:
      "After calling `loss.backward()` in a training loop, what happens to the computation graph by default? Which of the following correctly describes PyTorch's behavior and when you would override it?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "The graph is permanently stored in memory until you manually call `torch.clear_graph()`. This is why memory usage grows each epoch.",
      },
      {
        id: "B",
        text: "The graph is freed (destroyed) after `.backward()` is called. To call `.backward()` again on the same graph (e.g., for multiple losses), pass `retain_graph=True`.",
      },
      {
        id: "C",
        text: "The graph persists for 10 seconds and then is garbage collected. You can extend this with `retain_graph=True`.",
      },
      {
        id: "D",
        text: "The graph is only freed when you call `optimizer.zero_grad()`. This is why zero_grad() must come before backward().",
      },
    ],
    correctAnswer: "B",
    explanation:
      "By default, PyTorch frees the computation graph immediately after `.backward()` completes. This is a memory optimization — graphs can be large for deep networks. The graph is rebuilt on every forward pass, which is why PyTorch is called a *dynamic* computational graph framework (unlike TensorFlow 1.x's static graphs).\n\nYou need `retain_graph=True` when:\n- You want to call `.backward()` multiple times on the same output (e.g., computing separate gradients for a GAN's generator and discriminator)\n- You have multiple loss terms and call `.backward()` on each separately\n\n`optimizer.zero_grad()` is unrelated — it zeros the *accumulated gradients* in `.grad` attributes, not the computation graph itself. Forgetting `zero_grad()` causes gradients to accumulate across batches, which is a common bug.",
  },

  {
    id: "ptbasics-007",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Device Management CPU and CUDA",
    tags: ["cuda", "device", "to", "gpu", "cpu"],
    question:
      "PyTorch can run on CPU or GPU. You must explicitly move tensors and models to the same device — mixing devices causes a RuntimeError.\n\n**Tasks:**\n1. Write a function that detects whether CUDA is available and returns the appropriate device string (`'cuda'` or `'cpu'`)\n2. Create a tensor on CPU, then move it to the target device using `.to(device)`\n3. Define a simple `nn.Linear` model and move it to the device using `model.to(device)`\n4. Run a forward pass with the tensor through the model (both must be on same device)\n5. Return the result moved back to CPU\n\n**Best practice:**\n```python\ndevice = torch.device('cuda' if torch.cuda.is_available() else 'cpu')\n```",
    hint: "Use `torch.cuda.is_available()` to check for GPU. Both your model AND your input tensors must be on the same device. When returning results for logging/numpy conversion, move to CPU with `.cpu()`. `model.to(device)` moves all model parameters in-place; tensor `.to(device)` returns a new tensor.",
    starterCode: `import torch
import torch.nn as nn

def device_management_demo():
    """
    Demonstrate moving tensors and models between devices.
    Returns: (device_str, tensor_device, output_on_cpu)
    """
    # TODO: 1. Detect if CUDA is available; create device
    device = None
    device_str = None  # 'cuda' or 'cpu' as a string

    # TODO: 2. Create a (4, 8) random tensor on CPU, then move to device
    cpu_tensor = torch.randn(4, 8)
    tensor_on_device = None

    # TODO: 3. Create an nn.Linear(8, 4) model and move to device
    model = None

    # TODO: 4. Run forward pass (tensor and model both on same device)
    with torch.no_grad():
        output = None

    # TODO: 5. Move output back to CPU for numpy conversion etc.
    output_on_cpu = None

    return device_str, tensor_on_device.device.type, output_on_cpu`,
    solution: `import torch
import torch.nn as nn

def device_management_demo():
    # 1. Best practice: determine device once at top of script
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    device_str = device.type  # 'cuda' or 'cpu'

    # 2. Create tensor, move to device — .to() returns a new tensor
    cpu_tensor = torch.randn(4, 8)
    tensor_on_device = cpu_tensor.to(device)

    # 3. Model.to(device) moves all parameters IN-PLACE
    model = nn.Linear(8, 4)
    model.to(device)  # note: no need to reassign for models

    # 4. Both tensor and model are on the same device — forward pass works
    with torch.no_grad():
        output = model(tensor_on_device)  # shape: (4, 4)

    # 5. .cpu() moves back; needed before .numpy() or logging
    output_on_cpu = output.cpu()

    return device_str, tensor_on_device.device.type, output_on_cpu`,
    explanation:
      "PyTorch requires all tensors in an operation to be on the same device. The canonical pattern is to detect the device once with `torch.device('cuda' if torch.cuda.is_available() else 'cpu')` and use `.to(device)` everywhere. For tensors, `.to(device)` returns a *new* tensor (assign the result). For `nn.Module`, `.to(device)` modifies the module *in-place* (no reassignment needed, but it's harmless to reassign). Always move outputs back to CPU before calling `.numpy()` — NumPy doesn't support CUDA tensors.",
    testCases: `device_str, tensor_device_type, output_cpu = device_management_demo()

# Test 1: device string is valid
assert device_str in ('cuda', 'cpu')

# Test 2: tensor is on the correct device
assert tensor_device_type == device_str

# Test 3: output is back on CPU
assert output_cpu.device.type == 'cpu'

# Test 4: output shape is (4, 4) — Linear(8, 4) applied to (4, 8) input
assert output_cpu.shape == torch.Size([4, 4])`,
    timeComplexity: "O(n) for data transfer; forward pass O(b*in*out)",
    spaceComplexity: "O(n) for device copies",
  },

  {
    id: "ptbasics-008",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Your First nn.Module",
    tags: ["nn.Module", "MLP", "ReLU", "forward", "parameters"],
    question:
      "Every neural network in PyTorch is built by subclassing `nn.Module`. You implement two methods: `__init__` to define layers, and `forward` to describe the computation.\n\n**Task:** Build a two-layer MLP (multi-layer perceptron) classifier:\n- Input dimension: `input_dim`\n- Hidden dimension: `hidden_dim` with ReLU activation\n- Output dimension: `output_dim` (raw logits, no softmax)\n\n**Architecture:**\n```\nInput → Linear(input_dim, hidden_dim) → ReLU → Linear(hidden_dim, output_dim) → Output\n```\n\nAlso implement `count_parameters()` to return the total number of trainable parameters.",
    hint: "In `__init__`, call `super().__init__()` first, then define layers as `self.layer = nn.Linear(in, out)`. In `forward`, chain them: `x = self.relu(self.fc1(x))`. `nn.ReLU()` can be saved as an attribute or called inline with `torch.relu()`. Parameters = (in*out + out) per Linear layer (weights + biases).",
    starterCode: `import torch
import torch.nn as nn

class SimpleMLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        """
        Two-layer MLP: input → hidden (ReLU) → output
        """
        # TODO: Call parent __init__
        super().__init__()

        # TODO: Define fc1: Linear(input_dim → hidden_dim)
        self.fc1 = None

        # TODO: Define fc2: Linear(hidden_dim → output_dim)
        self.fc2 = None

        # TODO: Define relu activation
        self.relu = None

    def forward(self, x):
        """
        Forward pass: x → fc1 → relu → fc2 → output logits
        """
        # TODO: Implement forward pass
        pass

    def count_parameters(self):
        """Return total number of trainable parameters."""
        # TODO: Sum p.numel() for all parameters that require grad
        pass`,
    solution: `import torch
import torch.nn as nn

class SimpleMLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()  # ALWAYS call this first

        # nn.Linear(in_features, out_features) includes bias by default
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.relu = nn.ReLU()

    def forward(self, x):
        # Chain operations: each returns a new tensor
        x = self.fc1(x)    # (batch, input_dim) → (batch, hidden_dim)
        x = self.relu(x)   # ReLU: max(0, x) applied element-wise
        x = self.fc2(x)    # (batch, hidden_dim) → (batch, output_dim)
        return x            # raw logits; apply softmax for probabilities

    def count_parameters(self):
        # p.numel() = number of elements in parameter tensor
        # requires_grad=True filters to trainable params only
        return sum(p.numel() for p in self.parameters() if p.requires_grad)`,
    explanation:
      "`nn.Module` is the base class for all PyTorch models. The `__init__` method registers layers as attributes so PyTorch can track their parameters (for optimization, saving, moving to GPU). The `forward` method defines the actual computation — never call it directly; instead call the model like a function: `model(x)`, which triggers `__call__` (which handles hooks before calling `forward`). `nn.Linear(in, out)` applies `y = xW^T + b`. For a Linear(in, out) layer: parameters = in*out (weights) + out (bias). Our MLP: fc1 has `input_dim*hidden_dim + hidden_dim` params; fc2 has `hidden_dim*output_dim + output_dim` params.",
    testCases: `model = SimpleMLP(input_dim=10, hidden_dim=20, output_dim=5)

# Test 1: forward pass shape
x = torch.randn(8, 10)  # batch of 8 samples
output = model(x)
assert output.shape == torch.Size([8, 5])

# Test 2: parameter count
# fc1: 10*20 + 20 = 220; fc2: 20*5 + 5 = 105; total = 325
assert model.count_parameters() == 325

# Test 3: model has correct layers
assert hasattr(model, 'fc1') and isinstance(model.fc1, torch.nn.Linear)
assert hasattr(model, 'fc2') and isinstance(model.fc2, torch.nn.Linear)

# Test 4: output changes with different input (model is not trivially constant)
x2 = torch.randn(8, 10)
output2 = model(x2)
assert not torch.allclose(output, output2)`,
    timeComplexity: "O(b * hidden_dim * max(input_dim, output_dim)) per forward pass",
    spaceComplexity: "O(input_dim*hidden_dim + hidden_dim*output_dim) for parameters",
  },

  {
    id: "ptbasics-009",
    type: "knowledge",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Loss Functions Overview",
    tags: ["loss", "MSELoss", "CrossEntropyLoss", "BCELoss", "regression", "classification"],
    question:
      "Choosing the right loss function is fundamental. Match each loss function to its correct use case and input format. Which of the following is entirely correct?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "MSELoss → regression with continuous outputs; CrossEntropyLoss → multi-class classification with raw logits (applies softmax internally); BCEWithLogitsLoss → binary classification with raw logits (applies sigmoid internally).",
      },
      {
        id: "B",
        text: "MSELoss → multi-class classification; CrossEntropyLoss → regression with continuous outputs; BCELoss → binary classification requiring probabilities in [0, 1].",
      },
      {
        id: "C",
        text: "MSELoss → regression; CrossEntropyLoss → multi-class with softmax already applied (requires probability inputs); BCEWithLogitsLoss → binary with sigmoid already applied.",
      },
      {
        id: "D",
        text: "MSELoss → binary classification; CrossEntropyLoss → multi-class classification requiring one-hot encoded targets; BCEWithLogitsLoss → regression with bounded output.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "**MSELoss (Mean Squared Error):** Used for regression — predicting continuous values. Formula: mean((pred - target)^2). Inputs are raw model outputs and float targets.\n\n**CrossEntropyLoss:** Used for multi-class classification (C > 2 classes). Crucially, it *combines* `LogSoftmax + NLLLoss` internally — so you pass **raw logits** (not softmax outputs). Targets are class indices (integers), not one-hot vectors. Passing softmax outputs to CrossEntropyLoss is a common bug that produces incorrect gradients.\n\n**BCEWithLogitsLoss (Binary Cross-Entropy with Logits):** Used for binary classification or multi-label problems. It applies sigmoid internally, so you pass **raw logits**. Prefer this over `BCELoss(sigmoid(x))` because it's numerically more stable (avoids log(0) for saturated sigmoids).\n\n**Rule of thumb:** Use `WithLogits` variants whenever possible — they are faster and numerically stable.",
  },

  {
    id: "ptbasics-010",
    type: "knowledge",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Optimizers Overview",
    tags: ["SGD", "Adam", "AdamW", "optimizer", "learning-rate", "weight-decay"],
    question:
      "Explain the key differences between SGD, Adam, and AdamW optimizers. When would you prefer each one? What is the practical difference between Adam and AdamW regarding regularization?",
    format: "short-answer",
    options: null,
    correctAnswer:
      "SGD (Stochastic Gradient Descent) updates parameters using the raw gradient scaled by a learning rate. With momentum, it smooths updates by accumulating a velocity vector. SGD is simple, generalizes well, but requires careful learning rate tuning and scheduling. It is often preferred for image classification (ResNets, CNNs) with a cosine or step LR schedule.\n\nAdam (Adaptive Moment Estimation) maintains per-parameter adaptive learning rates using estimates of the first moment (mean gradient) and second moment (uncentered variance). It converges faster with less tuning, making it popular for NLP, transformers, and when training time matters. The downside is that its adaptive learning rates can sometimes generalize worse than SGD on image tasks.\n\nAdamW fixes a subtle bug in Adam's weight decay implementation. In Adam, weight decay is incorrectly scaled by the adaptive learning rate, making it less effective. AdamW decouples weight decay from the gradient update, applying it directly to the parameters. This makes regularization behave correctly. AdamW is now the default for training transformers (BERT, GPT) and is generally preferred over Adam whenever you use weight decay.",
    explanation:
      "**SGD with Momentum:**\n```python\noptimizer = torch.optim.SGD(model.parameters(), lr=0.01, momentum=0.9, weight_decay=1e-4)\n```\nBest for: image models (ResNet, VGG) with a careful LR schedule. Generalizes well but needs tuning.\n\n**Adam:**\n```python\noptimizer = torch.optim.Adam(model.parameters(), lr=1e-3, betas=(0.9, 0.999))\n```\nBest for: fast prototyping, NLP tasks, when you want reliable convergence without extensive tuning.\n\n**AdamW:**\n```python\noptimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)\n```\nBest for: transformers and attention-based models. The default in HuggingFace Transformers. Decoupled weight decay = correct L2 regularization.\n\n**Practical tip:** When in doubt, start with AdamW (lr=1e-3, weight_decay=0.01) — it works well across most architectures.",
  },

  {
    id: "ptbasics-011",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "DataLoader and Dataset",
    tags: ["Dataset", "DataLoader", "custom-dataset", "__getitem__", "__len__"],
    question:
      "PyTorch's `Dataset` and `DataLoader` classes standardize how data flows into your model. A `Dataset` knows how to retrieve one sample; a `DataLoader` handles batching, shuffling, and parallel loading.\n\n**Task:** Implement a `TensorDataset`-style class for tabular data:\n- `__init__`: accepts `X` (features tensor, shape `(N, features)`) and `y` (labels tensor, shape `(N,)`)\n- `__len__`: returns number of samples\n- `__getitem__`: returns a single `(x_i, y_i)` tuple by index\n\nThen create a `DataLoader` with `batch_size=4` and `shuffle=True`, and verify it works by iterating one batch.",
    hint: "The two mandatory methods for `Dataset` are `__len__` and `__getitem__`. The `DataLoader` wraps your dataset and handles all the batching logic. Use `next(iter(dataloader))` to grab the first batch without looping through everything.",
    starterCode: `import torch
from torch.utils.data import Dataset, DataLoader

class TabularDataset(Dataset):
    def __init__(self, X, y):
        """
        Args:
            X: torch.Tensor of shape (N, num_features)
            y: torch.Tensor of shape (N,)
        """
        # TODO: Store X and y as instance attributes
        pass

    def __len__(self):
        """Return the total number of samples."""
        # TODO: Return number of rows in X
        pass

    def __getitem__(self, idx):
        """Return (features, label) for sample at index idx."""
        # TODO: Return (X[idx], y[idx])
        pass

def create_dataloader(X, y, batch_size=4, shuffle=True):
    """Wrap dataset in a DataLoader and return it."""
    # TODO: Create TabularDataset and wrap in DataLoader
    pass`,
    solution: `import torch
from torch.utils.data import Dataset, DataLoader

class TabularDataset(Dataset):
    def __init__(self, X, y):
        # Store tensors — no copying, just references
        self.X = X
        self.y = y

    def __len__(self):
        # DataLoader uses this to know how many batches to create
        return len(self.X)

    def __getitem__(self, idx):
        # DataLoader calls this repeatedly, passing batch indices
        return self.X[idx], self.y[idx]

def create_dataloader(X, y, batch_size=4, shuffle=True):
    dataset = TabularDataset(X, y)
    # num_workers=0 for simplicity; increase for faster loading on real datasets
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)
    return loader`,
    explanation:
      "The `Dataset` / `DataLoader` pattern separates *what data looks like* from *how to load it in batches*. Your `Dataset` only needs to know: how many items there are (`__len__`) and how to get one item (`__getitem__`). The `DataLoader` does the heavy lifting: it calls `__getitem__` for a batch of indices, stacks the results into tensors, shuffles, and can use multiprocessing (`num_workers > 0`) for parallel loading. For real projects, your `__getitem__` might load images from disk, apply transforms, or read from a database — the interface stays the same.",
    testCases: `# Create synthetic data: 20 samples, 5 features, binary labels
X = torch.randn(20, 5)
y = torch.randint(0, 2, (20,)).float()

dataset = TabularDataset(X, y)

# Test 1: __len__
assert len(dataset) == 20

# Test 2: __getitem__ returns correct types and shapes
x_i, y_i = dataset[0]
assert x_i.shape == torch.Size([5])
assert y_i.shape == torch.Size([])  # scalar

# Test 3: DataLoader batching
loader = create_dataloader(X, y, batch_size=4)
batch_X, batch_y = next(iter(loader))
assert batch_X.shape == torch.Size([4, 5])
assert batch_y.shape == torch.Size([4])

# Test 4: Correct number of batches (20 / 4 = 5)
assert len(loader) == 5`,
    timeComplexity: "O(1) per __getitem__; O(batch_size) per DataLoader iteration",
    spaceComplexity: "O(N) for storing dataset in memory",
  },

  {
    id: "ptbasics-012",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Training Loop Template",
    tags: ["training-loop", "zero_grad", "backward", "step", "model.train", "model.eval"],
    question:
      "The training loop is the heart of every PyTorch project. It has a strict sequence that must be followed correctly.\n\n**Task:** Implement a complete `train_one_epoch` function and an `evaluate` function.\n\n**Training loop order (CRITICAL):**\n1. `model.train()` — enables dropout, batch norm training behavior\n2. `optimizer.zero_grad()` — clear accumulated gradients\n3. Forward pass: `outputs = model(X_batch)`\n4. Compute loss: `loss = criterion(outputs, y_batch)`\n5. `loss.backward()` — compute gradients\n6. `optimizer.step()` — update parameters\n\n**Evaluation loop:**\n1. `model.eval()` — disables dropout, uses running stats in batch norm\n2. Wrap in `torch.no_grad()` — skip gradient computation\n3. Compute predictions and metrics",
    hint: "The most common bugs: (1) forgetting `zero_grad()` causes gradient accumulation across batches, (2) calling `optimizer.step()` before `loss.backward()`, (3) forgetting `model.eval()` during validation. The order zero_grad → forward → loss → backward → step must be memorized.",
    starterCode: `import torch
import torch.nn as nn

def train_one_epoch(model, dataloader, criterion, optimizer):
    """
    Train the model for one epoch.
    Returns: average loss over all batches
    """
    # TODO: Set model to training mode
    total_loss = 0.0

    for X_batch, y_batch in dataloader:
        # TODO: 1. Zero out gradients from previous batch
        # TODO: 2. Forward pass
        # TODO: 3. Compute loss
        # TODO: 4. Backward pass
        # TODO: 5. Update parameters
        pass

        # TODO: Accumulate loss (use loss.item() to get Python float)

    avg_loss = total_loss / len(dataloader)
    return avg_loss

def evaluate(model, dataloader, criterion):
    """
    Evaluate model on a dataloader (no gradient computation).
    Returns: average loss over all batches
    """
    # TODO: Set model to eval mode
    total_loss = 0.0

    # TODO: Wrap in torch.no_grad()
    for X_batch, y_batch in dataloader:
        # TODO: Forward pass and compute loss (no backward)
        pass

    avg_loss = total_loss / len(dataloader)
    return avg_loss`,
    solution: `import torch
import torch.nn as nn

def train_one_epoch(model, dataloader, criterion, optimizer):
    model.train()  # enables dropout + training BatchNorm behavior
    total_loss = 0.0

    for X_batch, y_batch in dataloader:
        optimizer.zero_grad()          # 1. Clear old gradients (ALWAYS first)
        outputs = model(X_batch)       # 2. Forward pass
        loss = criterion(outputs, y_batch)  # 3. Compute scalar loss
        loss.backward()                # 4. Compute gradients via backprop
        optimizer.step()               # 5. Update weights using gradients

        total_loss += loss.item()      # .item() detaches from graph, gives float

    avg_loss = total_loss / len(dataloader)
    return avg_loss

def evaluate(model, dataloader, criterion):
    model.eval()   # disables dropout + uses running stats in BatchNorm
    total_loss = 0.0

    with torch.no_grad():  # skip building computation graph — saves memory
        for X_batch, y_batch in dataloader:
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            total_loss += loss.item()

    avg_loss = total_loss / len(dataloader)
    return avg_loss`,
    explanation:
      "`model.train()` and `model.eval()` switch the model between two modes that affect layers like `Dropout` (disabled during eval) and `BatchNorm` (uses running mean/variance during eval instead of batch statistics). This is a very common source of bugs — always switch modes explicitly.\n\n`optimizer.zero_grad()` must come before the forward pass. Gradients accumulate in `.grad` by default; without zeroing, each backward pass adds to the previous batch's gradients.\n\n`loss.item()` converts the 0-dimensional tensor to a Python float and detaches it from the computation graph — important for logging so you don't keep the graph alive.",
    testCases: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

# Build a trivial linear problem: y = sum(x)
torch.manual_seed(42)
X = torch.randn(40, 4)
y = X.sum(dim=1)
dataset = TensorDataset(X, y)
loader = DataLoader(dataset, batch_size=8)

model = nn.Linear(4, 1)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# Test 1: train_one_epoch returns a float
loss_val = train_one_epoch(model, loader, criterion, optimizer)
assert isinstance(loss_val, float)
assert loss_val > 0

# Test 2: evaluate returns a float without modifying weights
params_before = [p.clone() for p in model.parameters()]
eval_loss = evaluate(model, loader, criterion)
params_after = list(model.parameters())
assert isinstance(eval_loss, float)
for pb, pa in zip(params_before, params_after):
    assert torch.allclose(pb, pa)  # weights unchanged during eval

# Test 3: Loss decreases after several epochs
initial_loss = evaluate(model, loader, criterion)
for _ in range(50):
    train_one_epoch(model, loader, criterion, optimizer)
final_loss = evaluate(model, loader, criterion)
assert final_loss < initial_loss`,
    timeComplexity: "O(epochs * batches * model_forward_cost)",
    spaceComplexity: "O(model_params + batch_size * activations)",
  },

  {
    id: "ptbasics-013",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "core",
    title: "Save and Load Models",
    tags: ["state_dict", "save", "load", "checkpoint", "serialization"],
    question:
      "Saving and loading models correctly is critical for resuming training and deploying models.\n\n**Task:** Implement two approaches:\n\n**Approach 1 — Recommended (state_dict):**\n- Save: `torch.save(model.state_dict(), path)`\n- Load: create a new model instance, then `model.load_state_dict(torch.load(path))`\n\n**Approach 2 — Convenience (whole model):**\n- Save: `torch.save(model, path)`\n- Load: `model = torch.load(path)` (no need to define class first)\n\nImplement both save and load functions. Also save a full training checkpoint (model weights + optimizer state + epoch number).",
    hint: "Always use `state_dict()` for production — it saves only the parameters as a dict, not the class definition, so it is portable across code changes. When loading, pass `map_location='cpu'` to torch.load to avoid errors when the saved model was on GPU but you're loading on CPU.",
    starterCode: `import torch
import torch.nn as nn
import os

class SmallNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(4, 2)

    def forward(self, x):
        return self.fc(x)

def save_state_dict(model, path):
    """Save only model parameters (recommended approach)."""
    # TODO: Save the model's state_dict
    pass

def load_state_dict(path):
    """Load parameters into a fresh model instance."""
    # TODO: Create new SmallNet, load state dict, return model
    pass

def save_checkpoint(model, optimizer, epoch, path):
    """Save a full training checkpoint (weights + optimizer + epoch)."""
    # TODO: Build a dict with 'epoch', 'model_state', 'optimizer_state'
    #       and save it with torch.save
    pass

def load_checkpoint(path):
    """Load a checkpoint and return (model, optimizer, epoch)."""
    # TODO: Load checkpoint dict, reconstruct model and optimizer
    pass`,
    solution: `import torch
import torch.nn as nn
import os

class SmallNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(4, 2)

    def forward(self, x):
        return self.fc(x)

def save_state_dict(model, path):
    # state_dict() returns an OrderedDict of parameter name → tensor
    torch.save(model.state_dict(), path)

def load_state_dict(path):
    model = SmallNet()
    # map_location='cpu' ensures it loads even if saved on GPU
    state = torch.load(path, map_location='cpu')
    model.load_state_dict(state)
    model.eval()  # default to eval mode after loading
    return model

def save_checkpoint(model, optimizer, epoch, path):
    checkpoint = {
        'epoch': epoch,
        'model_state': model.state_dict(),
        'optimizer_state': optimizer.state_dict(),  # includes momentum, adaptive rates
    }
    torch.save(checkpoint, path)

def load_checkpoint(path):
    checkpoint = torch.load(path, map_location='cpu')
    model = SmallNet()
    model.load_state_dict(checkpoint['model_state'])
    optimizer = torch.optim.Adam(model.parameters())
    optimizer.load_state_dict(checkpoint['optimizer_state'])
    epoch = checkpoint['epoch']
    return model, optimizer, epoch`,
    explanation:
      "**Why state_dict over torch.save(model)?** Saving the full model with `torch.save(model, path)` uses Python's `pickle`, which embeds the class definition path. If you rename or move the class, loading breaks. The `state_dict` approach saves only the tensors as a plain dict — it is portable and robust to refactoring.\n\n**Why save optimizer state?** Optimizers like Adam maintain running statistics (momentum vectors, adaptive learning rates) per parameter. If you resume training without restoring the optimizer state, Adam resets its estimates and training behavior changes — you may see a loss spike.\n\n**`map_location='cpu'`** is a safety net: if the model was saved on GPU (`cuda`) but you load on a CPU-only machine, PyTorch raises a RuntimeError. Specifying `map_location='cpu'` prevents this.",
    testCases: `import tempfile, os
import torch

# Create and save model
model = SmallNet()
original_weights = model.fc.weight.data.clone()

with tempfile.NamedTemporaryFile(suffix='.pt', delete=False) as f:
    path = f.name

try:
    # Test 1: state_dict save/load round-trip
    save_state_dict(model, path)
    loaded_model = load_state_dict(path)
    assert torch.allclose(loaded_model.fc.weight.data, original_weights)

    # Test 2: loaded model produces same outputs
    x = torch.randn(3, 4)
    with torch.no_grad():
        out_orig = model(x)
        out_loaded = loaded_model(x)
    assert torch.allclose(out_orig, out_loaded)

    # Test 3: checkpoint includes all components
    optimizer = torch.optim.Adam(model.parameters())
    save_checkpoint(model, optimizer, epoch=5, path=path)
    m2, opt2, ep = load_checkpoint(path)
    assert ep == 5
    assert torch.allclose(m2.fc.weight.data, original_weights)
finally:
    os.unlink(path)`,
    timeComplexity: "O(P) where P is number of parameters",
    spaceComplexity: "O(P) disk and memory for the checkpoint",
  },

  {
    id: "ptbasics-014",
    type: "knowledge",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "standard",
    title: "Tensor Memory and Contiguity",
    tags: ["contiguous", "stride", "storage", "memory-layout", "view"],
    question:
      "Explain what it means for a PyTorch tensor to be *contiguous* in memory. What is a stride? When does `.view()` fail and what must you do to fix it? Give a concrete example of an operation that produces a non-contiguous tensor.",
    format: "short-answer",
    options: null,
    correctAnswer:
      "A contiguous tensor stores its elements in a single, uninterrupted block of memory in row-major (C-style) order. The stride of a tensor describes how many memory steps to take to move one position along each dimension. For a contiguous (3, 4) tensor, the strides are (4, 1): moving to the next row requires jumping 4 elements, moving to the next column requires jumping 1.\n\nOperations like .transpose(), .permute(), and some slices (e.g., x[::2]) return views that share the same underlying storage but with different strides or offsets. These tensors are non-contiguous — their logical layout differs from their physical memory layout.\n\n.view() requires the tensor to be contiguous because it relies on the memory being a single flat block that it can reinterpret with new strides. Calling .view() on a non-contiguous tensor raises: RuntimeError: view size is not compatible with input tensor's size and stride.\n\nFix: call .contiguous() first (copies data into a new contiguous block), then .view(). Or use .reshape(), which automatically handles non-contiguous tensors by calling .contiguous() internally when needed.",
    explanation:
      "**Concrete example:**\n```python\nx = torch.arange(12).reshape(3, 4)  # contiguous, strides=(4,1)\nxt = x.t()  # transpose → shape (4,3), strides=(1,4) — non-contiguous\n\nxt.is_contiguous()  # False\nxt.view(12)  # RuntimeError!\n\n# Fix option 1:\nxt.contiguous().view(12)  # OK — copies to new memory\n\n# Fix option 2:\nxt.reshape(12)  # OK — reshape handles it internally\n```\n\n**When does this matter in practice?**\n- When you slice with a step: `x[::2]` is non-contiguous\n- After `.permute()` for rearranging feature dimensions in CNNs (e.g., NCHW → NHWC)\n- When interfacing with code that requires contiguous memory (NumPy, C extensions)\n\n**Performance note:** `.contiguous()` allocates new memory and copies data — it is O(n). Avoid it in hot paths; try to structure your code to work with strides natively.",
  },

  {
    id: "ptbasics-015",
    type: "knowledge",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "standard",
    title: "torch.no_grad vs torch.inference_mode",
    tags: ["no_grad", "inference_mode", "autograd", "performance", "inference"],
    question:
      "Both `torch.no_grad()` and `torch.inference_mode()` disable gradient computation. Which statement correctly describes the differences between them and the appropriate use case for each?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "`torch.no_grad()` disables gradient tracking but tensors created inside it can still be used in a grad-enabled context later. `torch.inference_mode()` is stricter: tensors created inside it are permanently inert and cannot be used in future autograd computations. Use inference_mode for pure inference; no_grad when you may need the tensors downstream in training.",
      },
      {
        id: "B",
        text: "`torch.no_grad()` works only on CPU; `torch.inference_mode()` is the GPU-optimized equivalent. Use no_grad for CPU inference and inference_mode for GPU inference.",
      },
      {
        id: "C",
        text: "They are completely identical — inference_mode is just an alias for no_grad added for clarity in PyTorch 2.0. There is no functional difference.",
      },
      {
        id: "D",
        text: "`torch.no_grad()` only skips the forward pass computation graph; `torch.inference_mode()` skips both forward and backward passes. Use inference_mode to get a 2x speedup during training.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "**`torch.no_grad()`:** Disables gradient computation within the context. Tensors created inside do not have `grad_fn`, but they can still be used outside the context in autograd computations (they just won't have gradients themselves). Intermediate autograd metadata is still partially maintained.\n\n**`torch.inference_mode()` (PyTorch 1.9+):** A stronger version. Tensors created inside are *inference tensors* — they have a flag that permanently prevents them from entering the autograd graph. This allows PyTorch to skip even more overhead (no need to track version counters or save metadata). It is **faster** than `no_grad`.\n\n**When to use which:**\n- `inference_mode`: Use for deployment and evaluation where you will never need the tensors for gradients. This is the correct choice for `model.eval()` blocks and the `evaluate()` function in your training loop.\n- `no_grad`: Use when you need the tensors to potentially flow into autograd later (e.g., computing a reference tensor during training that is used in a loss but shouldn't itself be differentiated).\n\n**Practical guidance:** Default to `torch.inference_mode()` for all inference. The extra strictness prevents accidental autograd misuse and gives better performance.",
  },

  {
    id: "ptbasics-016",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "standard",
    title: "Learning Rate Schedulers",
    tags: ["scheduler", "StepLR", "CosineAnnealingLR", "learning-rate", "training"],
    question:
      "A fixed learning rate is rarely optimal — too high causes instability, too low causes slow convergence. Schedulers decay the learning rate over time.\n\n**Task:** Implement a training demo that:\n1. Creates an optimizer with initial `lr=0.1`\n2. Trains with `StepLR` (reduce LR by half every 5 epochs) for 15 epochs, recording LR each epoch\n3. Trains with `CosineAnnealingLR` (cosine decay to `eta_min=0.001` over 15 epochs) for 15 epochs, recording LR each epoch\n4. Returns both LR schedules as lists\n\n**Key rule:** Call `scheduler.step()` AFTER `optimizer.step()`, once per epoch.",
    hint: "Use `optimizer.param_groups[0]['lr']` to read the current learning rate. `StepLR(optimizer, step_size=5, gamma=0.5)` halves the LR every 5 epochs. `CosineAnnealingLR(optimizer, T_max=15, eta_min=0.001)` follows a cosine curve from initial LR down to eta_min. Always create a fresh optimizer for each experiment.",
    starterCode: `import torch
import torch.nn as nn
from torch.optim.lr_scheduler import StepLR, CosineAnnealingLR

def lr_scheduler_demo():
    """
    Compare StepLR vs CosineAnnealingLR over 15 epochs.
    Returns: (step_lrs, cosine_lrs) — lists of LR values per epoch
    """
    # Dummy model and data for the demo
    model_a = nn.Linear(4, 1)
    model_b = nn.Linear(4, 1)
    X = torch.randn(16, 4)
    y = torch.randn(16, 1)
    criterion = nn.MSELoss()

    # --- Experiment 1: StepLR ---
    # TODO: Create optimizer with lr=0.1 for model_a
    opt_step = None
    # TODO: Create StepLR: halve LR every 5 epochs (gamma=0.5)
    scheduler_step = None

    step_lrs = []
    for epoch in range(15):
        # TODO: Record current LR
        # TODO: Run a training step (forward, loss, backward, opt step)
        # TODO: Call scheduler.step()
        pass

    # --- Experiment 2: CosineAnnealingLR ---
    # TODO: Create optimizer with lr=0.1 for model_b
    opt_cos = None
    # TODO: Create CosineAnnealingLR: T_max=15, eta_min=0.001
    scheduler_cos = None

    cosine_lrs = []
    for epoch in range(15):
        # TODO: Record current LR
        # TODO: Run a training step
        # TODO: Call scheduler.step()
        pass

    return step_lrs, cosine_lrs`,
    solution: `import torch
import torch.nn as nn
from torch.optim.lr_scheduler import StepLR, CosineAnnealingLR

def lr_scheduler_demo():
    model_a = nn.Linear(4, 1)
    model_b = nn.Linear(4, 1)
    X = torch.randn(16, 4)
    y = torch.randn(16, 1)
    criterion = nn.MSELoss()

    # --- Experiment 1: StepLR ---
    opt_step = torch.optim.SGD(model_a.parameters(), lr=0.1)
    # Multiplies LR by gamma every step_size epochs: 0.1 → 0.05 → 0.025
    scheduler_step = StepLR(opt_step, step_size=5, gamma=0.5)

    step_lrs = []
    for epoch in range(15):
        step_lrs.append(opt_step.param_groups[0]['lr'])  # record BEFORE step
        opt_step.zero_grad()
        loss = criterion(model_a(X), y)
        loss.backward()
        opt_step.step()
        scheduler_step.step()  # update LR AFTER optimizer step

    # --- Experiment 2: CosineAnnealingLR ---
    opt_cos = torch.optim.SGD(model_b.parameters(), lr=0.1)
    # Smoothly decays from 0.1 to eta_min=0.001 following cosine curve
    scheduler_cos = CosineAnnealingLR(opt_cos, T_max=15, eta_min=0.001)

    cosine_lrs = []
    for epoch in range(15):
        cosine_lrs.append(opt_cos.param_groups[0]['lr'])
        opt_cos.zero_grad()
        loss = criterion(model_b(X), y)
        loss.backward()
        opt_cos.step()
        scheduler_cos.step()

    return step_lrs, cosine_lrs`,
    explanation:
      "**StepLR** is simple and predictable: the LR drops by a fixed factor (`gamma`) every `step_size` epochs. Good for problems where you know roughly when to reduce the LR.\n\n**CosineAnnealingLR** follows a cosine curve, smoothly annealing the LR from its initial value to `eta_min`. It avoids sudden drops and often helps the optimizer find flatter minima. It is widely used in image classification training (e.g., training ResNets for 300 epochs with cosine schedule).\n\n**Critical ordering:** `scheduler.step()` must come *after* `optimizer.step()`. Calling it before caused incorrect LR values in PyTorch < 1.4 and will emit a warning in newer versions. Record the LR at the start of each epoch (before stepping) to get an accurate log of what LR was used during that epoch.",
    testCases: `step_lrs, cosine_lrs = lr_scheduler_demo()

# Test 1: correct number of LR values
assert len(step_lrs) == 15
assert len(cosine_lrs) == 15

# Test 2: StepLR starts at 0.1
assert abs(step_lrs[0] - 0.1) < 1e-6

# Test 3: StepLR halves at epochs 5 and 10
assert abs(step_lrs[5] - 0.05) < 1e-6
assert abs(step_lrs[10] - 0.025) < 1e-6

# Test 4: Cosine starts at 0.1
assert abs(cosine_lrs[0] - 0.1) < 1e-6

# Test 5: Cosine is monotonically non-increasing (it decays)
for i in range(len(cosine_lrs) - 1):
    assert cosine_lrs[i] >= cosine_lrs[i+1] - 1e-9

# Test 6: Cosine last value approaches eta_min=0.001
assert cosine_lrs[-1] >= 0.001 - 1e-6`,
    timeComplexity: "O(epochs * batch_size * model_params)",
    spaceComplexity: "O(1) additional for scheduler",
  },

  {
    id: "ptbasics-017",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "standard",
    title: "Debugging Shape Errors",
    tags: ["debugging", "shape", "matmul", "reshape", "error-fixing"],
    question:
      "Shape errors are the most common bugs in PyTorch. Given the buggy code below, identify and fix **four shape-related errors**.\n\n**Buggy code:**\n```python\nimport torch\nimport torch.nn as nn\n\n# Bug 1: Wrong output in a Linear layer for batched input\nbatch_x = torch.randn(32, 128)   # (batch=32, features=128)\nlinear = nn.Linear(64, 10)       # expects 64 inputs!\nout1 = linear(batch_x)           # RuntimeError\n\n# Bug 2: Incorrect matmul dimensions\nA = torch.randn(3, 4)\nB = torch.randn(3, 4)            # should be (4, N) for A @ B\nresult = A @ B                   # RuntimeError\n\n# Bug 3: Loss function receives wrong input shape\nlogits = torch.randn(8, 5)       # (batch=8, classes=5)\ntargets = torch.randint(0, 5, (8, 1))  # should be (8,) not (8,1)\nloss_fn = nn.CrossEntropyLoss()\nloss = loss_fn(logits, targets)  # RuntimeError\n\n# Bug 4: Concatenating tensors with mismatched non-cat dimensions\nx = torch.randn(4, 3)\ny = torch.randn(4, 5)\nwrong = torch.cat([x, y], dim=0)  # should be dim=1 to cat along features\n```\n\nFix all four bugs in the `fix_shape_bugs()` function.",
    hint: "For Bug 1: make sure `nn.Linear(in, out)` matches the last dimension of your input. For Bug 2: matmul `A @ B` requires A's last dim == B's second-to-last dim. For Bug 3: `CrossEntropyLoss` expects targets of shape `(batch,)` as integers, not `(batch, 1)`. For Bug 4: `torch.cat(dim=1)` concatenates along the feature dimension; `dim=0` concatenates along the batch dimension.",
    starterCode: `import torch
import torch.nn as nn

def fix_shape_bugs():
    """
    Fix four shape bugs. Return the corrected outputs.
    Returns: (out1, result, loss, concat_result)
    """
    # Bug 1 FIX: Linear layer input/output dimension mismatch
    batch_x = torch.randn(32, 128)
    # TODO: Fix the Linear layer so it accepts 128-dim input and outputs 10
    linear = nn.Linear(64, 10)   # <-- WRONG: fix this
    out1 = linear(batch_x)

    # Bug 2 FIX: Incompatible matmul dimensions
    A = torch.randn(3, 4)
    B = torch.randn(3, 4)         # <-- WRONG shape for B
    # TODO: Fix B's shape so A @ B works
    result = A @ B

    # Bug 3 FIX: CrossEntropyLoss target shape
    logits = torch.randn(8, 5)
    targets = torch.randint(0, 5, (8, 1))  # <-- WRONG: fix targets shape
    loss_fn = nn.CrossEntropyLoss()
    # TODO: Fix targets before passing to loss_fn
    loss = loss_fn(logits, targets)

    # Bug 4 FIX: Wrong cat dimension
    x = torch.randn(4, 3)
    y = torch.randn(4, 5)
    # TODO: Fix the cat dimension to concatenate along features (axis=1)
    concat_result = torch.cat([x, y], dim=0)  # <-- WRONG: fix dim

    return out1, result, loss, concat_result`,
    solution: `import torch
import torch.nn as nn

def fix_shape_bugs():
    # Bug 1 FIX: Change Linear(64, 10) to Linear(128, 10)
    batch_x = torch.randn(32, 128)
    linear = nn.Linear(128, 10)  # in_features must match last dim of input
    out1 = linear(batch_x)       # (32, 128) @ (128, 10) → (32, 10)

    # Bug 2 FIX: Transpose B so dimensions are (4, N) for A@B
    A = torch.randn(3, 4)
    B = torch.randn(4, 2)         # B must be (4, anything); A is (3,4) so B is (4,N)
    result = A @ B                # (3,4) @ (4,2) → (3,2)

    # Bug 3 FIX: Squeeze targets from (8,1) to (8,)
    logits = torch.randn(8, 5)
    targets = torch.randint(0, 5, (8, 1))
    targets = targets.squeeze(1)  # or .view(-1) or .flatten()
    loss_fn = nn.CrossEntropyLoss()
    loss = loss_fn(logits, targets)  # targets must be (batch,) of class indices

    # Bug 4 FIX: Use dim=1 to concat along features
    x = torch.randn(4, 3)
    y = torch.randn(4, 5)
    concat_result = torch.cat([x, y], dim=1)  # (4,3) cat (4,5) → (4,8)

    return out1, result, loss, concat_result`,
    explanation:
      "**Bug 1:** `nn.Linear(in, out)` — `in` must match the last dimension of your input tensor. Rule: always check `model_layer.in_features` against `your_tensor.shape[-1]`.\n\n**Bug 2:** For `A @ B`, A's shape `(..., m, n)` requires B's shape `(..., n, p)`. The inner dimensions must match. Quick check: write shapes side by side and verify the touching numbers match: `(3,4) @ (4,2)` → inner 4==4 ✓.\n\n**Bug 3:** `CrossEntropyLoss` targets must have shape `(batch,)` containing class indices as `torch.long`. Shape `(batch, 1)` causes a shape mismatch. Fix with `.squeeze(1)` or `.view(-1)`. This is one of the most common PyTorch bugs.\n\n**Bug 4:** `torch.cat(tensors, dim=d)` concatenates along dimension `d`. The two tensors must have identical sizes in ALL OTHER dimensions. `dim=0` stacks rows (requires same number of columns); `dim=1` stacks columns (requires same number of rows).",
    testCases: `out1, result, loss, concat_result = fix_shape_bugs()

# Test 1: Linear output shape
assert out1.shape == torch.Size([32, 10])

# Test 2: Matmul result shape
assert result.shape[0] == 3  # 3 rows from A
assert len(result.shape) == 2

# Test 3: Loss is a scalar
assert loss.shape == torch.Size([])
assert loss.item() > 0

# Test 4: Concat along features
assert concat_result.shape == torch.Size([4, 8])  # 4 rows, 3+5=8 cols`,
    timeComplexity: "O(n) per operation",
    spaceComplexity: "O(n) for intermediate tensors",
  },

  {
    id: "ptbasics-018",
    type: "coding",
    category: "pytorch-basics",
    categoryLabel: "PyTorch Basics",
    difficulty: "standard",
    title: "Data Augmentation with Transforms",
    tags: ["transforms", "torchvision", "augmentation", "Compose", "Normalize", "ToTensor"],
    question:
      "Data augmentation reduces overfitting by artificially expanding your training set with realistic variations of existing images. PyTorch uses `torchvision.transforms` to build a pipeline.\n\n**Task:** Build two transform pipelines:\n\n**Training pipeline** (augmentation + normalization):\n- `RandomHorizontalFlip(p=0.5)` — random left/right flip\n- `RandomCrop(32, padding=4)` — random crop with padding\n- `ColorJitter(brightness=0.2, contrast=0.2)` — random color changes\n- `ToTensor()` — convert PIL Image to tensor, scales [0,255] → [0,1]\n- `Normalize(mean=[0.5,0.5,0.5], std=[0.5,0.5,0.5])` — normalize to [-1,1]\n\n**Evaluation pipeline** (deterministic, no augmentation):\n- `Resize(32)` — ensure consistent size\n- `ToTensor()`\n- `Normalize(mean=[0.5,0.5,0.5], std=[0.5,0.5,0.5])`\n\nAlso show how to apply a transform to a dummy tensor to verify the output shape.",
    hint: "Use `transforms.Compose([...])` to chain transforms in order. The order matters: augmentation transforms come first, then `ToTensor()`, then `Normalize()`. Normalize must come after ToTensor because it expects float tensors in [0,1]. For testing without a real image, you can use `torch.rand(3, 32, 32)` and apply only tensor-compatible transforms.",
    starterCode: `import torch
from torchvision import transforms

def build_train_transform():
    """
    Build augmentation + normalization pipeline for training.
    Returns a torchvision.transforms.Compose object.
    """
    # TODO: Create a Compose pipeline with:
    # RandomHorizontalFlip(0.5), RandomCrop(32, padding=4),
    # ColorJitter(brightness=0.2, contrast=0.2),
    # ToTensor(), Normalize([0.5,0.5,0.5], [0.5,0.5,0.5])
    pass

def build_eval_transform():
    """
    Build deterministic pipeline for validation/testing (no augmentation).
    Returns a torchvision.transforms.Compose object.
    """
    # TODO: Create a Compose pipeline with:
    # Resize(32), ToTensor(), Normalize([0.5,0.5,0.5], [0.5,0.5,0.5])
    pass

def apply_tensor_normalize(tensor):
    """
    Apply only the tensor-compatible part of the eval pipeline
    (Normalize) to an already-converted tensor of shape (3, 32, 32).
    Returns the normalized tensor.
    """
    # TODO: Apply Normalize([0.5,0.5,0.5], [0.5,0.5,0.5]) to tensor
    pass`,
    solution: `import torch
from torchvision import transforms

def build_train_transform():
    # Order: spatial augmentations → color augmentations → ToTensor → Normalize
    train_transform = transforms.Compose([
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomCrop(32, padding=4),      # pad by 4 px, then random crop to 32
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),                      # PIL Image → float tensor [0,1]
        transforms.Normalize(                       # normalize each channel
            mean=[0.5, 0.5, 0.5],
            std=[0.5, 0.5, 0.5]
        ),                                          # output range: [-1, 1]
    ])
    return train_transform

def build_eval_transform():
    # No random ops — evaluation must be deterministic and reproducible
    eval_transform = transforms.Compose([
        transforms.Resize(32),                     # ensure consistent size
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.5, 0.5, 0.5],
            std=[0.5, 0.5, 0.5]
        ),
    ])
    return eval_transform

def apply_tensor_normalize(tensor):
    # Normalize works directly on tensors — mean and std applied per channel
    normalize = transforms.Normalize(
        mean=[0.5, 0.5, 0.5],
        std=[0.5, 0.5, 0.5]
    )
    return normalize(tensor)`,
    explanation:
      "**Why augmentation only for training?** Augmentation adds randomness to help the model generalize. During evaluation, you want deterministic, reproducible results — using random augmentation on the validation set would make metrics vary between runs.\n\n**Why Normalize after ToTensor?** `ToTensor()` converts a PIL image (uint8, [0,255]) to a float tensor ([0.0, 1.0]). `Normalize()` expects floats and computes `(x - mean) / std` per channel. The formula with mean=0.5, std=0.5 maps [0,1] → [-1,1], which is a common choice for image networks.\n\n**Real-world mean/std:** For CIFAR-10, the canonical values are `mean=[0.4914, 0.4822, 0.4465], std=[0.247, 0.243, 0.261]` — computed from the actual dataset statistics. Using dataset-specific statistics improves training stability.\n\n**Transform philosophy:** Transforms are composable and lightweight. You can mix geometric transforms (flips, crops, rotations), color transforms (jitter, grayscale), and tensor operations (normalize, erase) in any combination. Libraries like Albumentations offer faster alternatives for heavy augmentation pipelines.",
    testCases: `import torch
from torchvision import transforms

train_t = build_train_transform()
eval_t = build_eval_transform()

# Test 1: train transform is a Compose object with 5 transforms
assert isinstance(train_t, transforms.Compose)
assert len(train_t.transforms) == 5

# Test 2: eval transform is a Compose with 3 transforms
assert isinstance(eval_t, transforms.Compose)
assert len(eval_t.transforms) == 3

# Test 3: apply_tensor_normalize normalizes correctly
# A tensor of all 0.5 values with mean=0.5, std=0.5 → (0.5-0.5)/0.5 = 0.0
tensor_gray = torch.ones(3, 32, 32) * 0.5
normalized = apply_tensor_normalize(tensor_gray)
assert normalized.shape == torch.Size([3, 32, 32])
assert abs(normalized.mean().item()) < 1e-5  # should be ~0

# Test 4: Normalize maps [0,1] range to [-1,1]
tensor_white = torch.ones(3, 32, 32)   # all 1.0
norm_white = apply_tensor_normalize(tensor_white)
assert abs(norm_white.mean().item() - 1.0) < 1e-5  # (1.0-0.5)/0.5 = 1.0

tensor_black = torch.zeros(3, 32, 32)  # all 0.0
norm_black = apply_tensor_normalize(tensor_black)
assert abs(norm_black.mean().item() - (-1.0)) < 1e-5  # (0.0-0.5)/0.5 = -1.0`,
    timeComplexity: "O(H*W*C) per image for transform application",
    spaceComplexity: "O(H*W*C) for the transformed image",
  },
];

export default pytorchBasics;
