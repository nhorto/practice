const agentsToolUse = [
  // ─── Coding Questions (9) ────────────────────────────────────────────

  {
    id: "agents-001",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "core",
    title: "Anthropic Tool Definition Schema",
    tags: ["anthropic", "tool-definition", "json-schema", "input_schema"],
    question:
      "Write tool definitions for a **weather API tool** and a **calculator tool** in Anthropic's tool format.\n\nEach tool must have:\n- `name` — snake_case identifier\n- `description` — clear explanation of what the tool does and when to use it\n- `input_schema` — JSON Schema object with `type`, `properties`, and `required`\n\n**Weather tool inputs:** `location` (string, required), `unit` (string, optional, enum of `celsius`/`fahrenheit`)\n**Calculator tool inputs:** `expression` (string, required) — a math expression like `'2 + 2'` or `'sqrt(144)'`",
    hint: "Anthropic's format uses `input_schema` (not `parameters`). The top-level schema must have `type: 'object'` and a `properties` dict. Mark required fields in a `required` array at the top level of the schema.",
    starterCode: `# Define Anthropic-format tool definitions

# TODO: Define the weather tool
weather_tool = {
    # name, description, input_schema
}

# TODO: Define the calculator tool
calculator_tool = {
    # name, description, input_schema
}

tools = [weather_tool, calculator_tool]`,
    solution: `# Anthropic tool definitions

weather_tool = {
    "name": "get_weather",
    "description": (
        "Get the current weather for a given location. "
        "Use this when the user asks about weather conditions, temperature, "
        "or forecast for any city or region."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "The city and state or country, e.g. 'San Francisco, CA' or 'London, UK'",
            },
            "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "Temperature unit. Defaults to fahrenheit.",
            },
        },
        "required": ["location"],
    },
}

calculator_tool = {
    "name": "calculate",
    "description": (
        "Evaluate a mathematical expression and return the result. "
        "Supports arithmetic (+, -, *, /), exponentiation (**), "
        "and common functions like sqrt(), abs(), round(). "
        "Use this for any numeric computation."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": "A valid Python math expression, e.g. '2 + 2', '10 / 3', 'sqrt(144)'",
            },
        },
        "required": ["expression"],
    },
}

tools = [weather_tool, calculator_tool]`,
    explanation:
      "Anthropic's tool format uses `input_schema` (not `parameters` like OpenAI). The schema is standard JSON Schema: `type: 'object'` at the top level, a `properties` dict where each key is a parameter name, and a `required` array listing mandatory fields. Optional fields simply omit their name from `required`. The `description` field on both the tool and each property is crucial — it tells the model when and how to use the tool correctly.",
    testCases: `# Validate structure
assert weather_tool["name"] == "get_weather"
assert "input_schema" in weather_tool
assert weather_tool["input_schema"]["type"] == "object"
assert "location" in weather_tool["input_schema"]["properties"]
assert "location" in weather_tool["input_schema"]["required"]
assert "unit" not in weather_tool["input_schema"]["required"]  # optional

assert calculator_tool["name"] == "calculate"
assert "expression" in calculator_tool["input_schema"]["required"]

# Validate unit enum
unit_prop = weather_tool["input_schema"]["properties"]["unit"]
assert "enum" in unit_prop
assert set(unit_prop["enum"]) == {"celsius", "fahrenheit"}

print("All tool definition checks passed.")`,
    timeComplexity: "N/A",
    spaceComplexity: "N/A",
  },

  {
    id: "agents-002",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "core",
    title: "OpenAI Tool Definition Schema",
    tags: ["openai", "tool-definition", "function-calling", "json-schema"],
    question:
      "Write the same **weather** and **calculator** tool definitions in OpenAI's function-calling format.\n\nOpenAI's format wraps each tool as:\n```python\n{\n  'type': 'function',\n  'function': {\n    'name': ...,\n    'description': ...,\n    'parameters': { JSON Schema }\n  }\n}\n```\n\nNote the key differences from Anthropic:\n- Top-level wrapper: `{type: 'function', function: {...}}`\n- Schema key is `parameters`, not `input_schema`\n- `strict: True` can be added for structured outputs (optional)\n\nWrite both tool definitions and a `tools` list.",
    hint: "The JSON Schema inside `parameters` is identical in structure to Anthropic's `input_schema`. The main difference is the outer wrapper object with `type: 'function'` and the key name change from `input_schema` to `parameters`.",
    starterCode: `# Define OpenAI-format tool definitions

# TODO: Define the weather tool (OpenAI format)
weather_tool = {
    # type, function: { name, description, parameters }
}

# TODO: Define the calculator tool (OpenAI format)
calculator_tool = {
    # type, function: { name, description, parameters }
}

tools = [weather_tool, calculator_tool]`,
    solution: `# OpenAI tool definitions

weather_tool = {
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": (
            "Get the current weather for a given location. "
            "Use this when the user asks about weather conditions, temperature, "
            "or forecast for any city or region."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state or country, e.g. 'San Francisco, CA'",
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit. Defaults to fahrenheit.",
                },
            },
            "required": ["location"],
        },
    },
}

calculator_tool = {
    "type": "function",
    "function": {
        "name": "calculate",
        "description": (
            "Evaluate a mathematical expression and return the result. "
            "Use this for any numeric computation."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "A valid math expression, e.g. '2 + 2', 'sqrt(144)'",
                },
            },
            "required": ["expression"],
        },
    },
}

tools = [weather_tool, calculator_tool]`,
    explanation:
      "OpenAI's format adds a `{type: 'function', function: {...}}` wrapper around each tool. Inside, `parameters` (not `input_schema`) holds the JSON Schema. The schema itself is structurally identical to Anthropic's format. The key interview point: when switching between APIs, you only need to reshape the outer wrapper and rename `input_schema` to `parameters`. The JSON Schema contents stay the same.",
    testCases: `# Validate OpenAI structure
assert weather_tool["type"] == "function"
assert "function" in weather_tool
assert weather_tool["function"]["name"] == "get_weather"
assert "parameters" in weather_tool["function"]
assert "input_schema" not in weather_tool["function"]  # NOT Anthropic format

params = weather_tool["function"]["parameters"]
assert params["type"] == "object"
assert "location" in params["required"]

assert calculator_tool["type"] == "function"
assert calculator_tool["function"]["name"] == "calculate"
assert "expression" in calculator_tool["function"]["parameters"]["required"]

print("All OpenAI tool definition checks passed.")`,
    timeComplexity: "N/A",
    spaceComplexity: "N/A",
  },

  {
    id: "agents-003",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "core",
    title: "Agent While Loop - Anthropic SDK",
    tags: ["anthropic", "agent-loop", "tool-use", "stop_reason", "tool_result"],
    question:
      "Implement a complete **Anthropic agent loop** in Python.\n\nThe agent should:\n1. Send messages to the API with tool definitions\n2. If `stop_reason == 'end_turn'`, return the final text response\n3. If `stop_reason == 'tool_use'`, extract all `tool_use` blocks from `response.content`\n4. Execute each tool call (dispatch to the right handler)\n5. Format results as `tool_result` content blocks and append to messages\n6. Loop until done or `max_iterations` is reached\n\n**Message format for tool results (Anthropic):**\n```python\n{'role': 'user', 'content': [\n  {'type': 'tool_result', 'tool_use_id': ..., 'content': ...}\n]}\n```\n\nInclude realistic tool definitions and handler functions so this could actually run.",
    hint: "Key details: (1) append the full `response.content` (not just text) as the assistant turn, (2) tool results go in a `user` message as a list of `tool_result` blocks, (3) each `tool_result` must reference the `tool_use_id` from the request, (4) check `stop_reason` not the content type to decide what to do next.",
    starterCode: `import anthropic
import json
import math

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

# Tool definitions (Anthropic format)
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
            },
            "required": ["location"],
        },
    },
    {
        "name": "calculate",
        "description": "Evaluate a math expression.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string"},
            },
            "required": ["expression"],
        },
    },
]

# --- Tool handlers ---

def handle_get_weather(location, unit="fahrenheit"):
    # TODO: Implement mock weather response
    pass

def handle_calculate(expression):
    # TODO: Implement safe math evaluator
    pass

def execute_tool(tool_name, tool_input):
    # TODO: Dispatch to the right handler, return string result
    pass

# --- Agent loop ---

def run_agent(user_message, max_iterations=10):
    """
    Run the Anthropic agent loop until end_turn or max iterations.

    Returns the final text response from the model.
    """
    messages = [{"role": "user", "content": user_message}]
    system_prompt = "You are a helpful assistant with access to weather and calculator tools."

    for iteration in range(max_iterations):
        # TODO: Call the API

        # TODO: If stop_reason == 'end_turn', extract and return text

        # TODO: If stop_reason == 'tool_use':
        #   1. Append assistant response to messages
        #   2. Extract all tool_use blocks
        #   3. Execute each tool
        #   4. Build tool_result blocks
        #   5. Append user message with results

        pass

    return "Max iterations reached."

# Test
if __name__ == "__main__":
    result = run_agent("What's the weather in Tokyo and what is 15 * 23?")
    print(result)`,
    solution: `import anthropic
import json
import math

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

# Tool definitions (Anthropic format)
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location. Use when user asks about weather.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City and country, e.g. 'Tokyo, Japan'",
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit",
                },
            },
            "required": ["location"],
        },
    },
    {
        "name": "calculate",
        "description": "Evaluate a mathematical expression. Use for any numeric computation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Math expression, e.g. '15 * 23' or 'sqrt(144)'",
                },
            },
            "required": ["expression"],
        },
    },
]

# --- Tool handlers ---

def handle_get_weather(location, unit="fahrenheit"):
    """Mock weather API call."""
    # In production: call a real weather API here
    temp = 72 if unit == "fahrenheit" else 22
    return json.dumps({
        "location": location,
        "temperature": temp,
        "unit": unit,
        "condition": "Partly cloudy",
        "humidity": "65%",
    })

def handle_calculate(expression):
    """Safely evaluate a math expression."""
    try:
        # Safe eval: only allow math operations
        allowed_names = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        result = eval(expression, {"__builtins__": {}}, allowed_names)
        return str(result)
    except Exception as e:
        return f"Error evaluating expression: {e}"

def execute_tool(tool_name, tool_input):
    """Dispatch tool call to the appropriate handler."""
    if tool_name == "get_weather":
        return handle_get_weather(
            location=tool_input["location"],
            unit=tool_input.get("unit", "fahrenheit"),
        )
    elif tool_name == "calculate":
        return handle_calculate(expression=tool_input["expression"])
    else:
        return f"Unknown tool: {tool_name}"

# --- Agent loop ---

def run_agent(user_message, max_iterations=10):
    """
    Run the Anthropic agent loop until end_turn or max iterations.

    Returns the final text response from the model.
    """
    messages = [{"role": "user", "content": user_message}]
    system_prompt = "You are a helpful assistant with access to weather and calculator tools."

    for iteration in range(max_iterations):
        # 1. Call the API
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4096,
            system=system_prompt,
            messages=messages,
            tools=tools,
        )

        # 2. Check stop reason
        if response.stop_reason == "end_turn":
            # Extract text from the last content block
            for block in response.content:
                if block.type == "text":
                    return block.text
            return ""

        if response.stop_reason == "tool_use":
            # 3. Append the full assistant response (including tool_use blocks)
            messages.append({"role": "assistant", "content": response.content})

            # 4. Extract all tool_use blocks and execute them
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,   # Must match the tool_use id
                        "content": result,
                    })

            # 5. Append tool results as a user message
            messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached without a final answer."

# Test
if __name__ == "__main__":
    result = run_agent("What's the weather in Tokyo (celsius) and what is 15 * 23?")
    print(result)`,
    explanation:
      "The Anthropic agent loop has two branches based on `stop_reason`. On `end_turn`, the model is done — extract text and return. On `tool_use`, do three things: (1) append the full `response.content` (not just text — it contains `tool_use` blocks the model needs to see) as an assistant turn, (2) execute every `tool_use` block, (3) send results back in a `user` message as `tool_result` blocks, each referencing the matching `tool_use_id`. The `tool_use_id` pairing is critical — the model uses it to correlate which result matches which call. The loop continues until `end_turn` or the iteration limit.",
    testCases: `# Unit test the dispatch layer (no API call needed)
result = execute_tool("calculate", {"expression": "15 * 23"})
assert result == "345", f"Expected '345', got {result}"

result = execute_tool("calculate", {"expression": "sqrt(144)"})
assert result == "12.0", f"Expected '12.0', got {result}"

result = execute_tool("get_weather", {"location": "Tokyo", "unit": "celsius"})
import json
data = json.loads(result)
assert data["location"] == "Tokyo"
assert data["unit"] == "celsius"

result = execute_tool("unknown_tool", {})
assert "Unknown tool" in result

print("All agent dispatch tests passed.")`,
    timeComplexity: "O(iterations * tools_per_turn)",
    spaceComplexity: "O(message_history_length)",
  },

  {
    id: "agents-004",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "core",
    title: "Agent While Loop - OpenAI SDK",
    tags: ["openai", "agent-loop", "tool-calls", "finish_reason", "function-calling"],
    question:
      "Implement the same agent loop using the **OpenAI SDK**.\n\nKey differences from Anthropic:\n- `response.choices[0].finish_reason` instead of `response.stop_reason`\n- `finish_reason == 'tool_calls'` (not `'tool_use'`)\n- Tool calls are in `response.choices[0].message.tool_calls` (not content blocks)\n- Each tool call has: `id`, `function.name`, `function.arguments` (a JSON **string**, not dict)\n- Tool results go in a message with `role: 'tool'` (not `role: 'user'`)\n- Must include `tool_call_id` in each result message\n\n**Tool result message format (OpenAI):**\n```python\n{'role': 'tool', 'tool_call_id': ..., 'content': ...}\n```\n\nUse the same weather and calculator tools from agents-001/002.",
    hint: "Three OpenAI-specific gotchas: (1) `function.arguments` is a JSON string — you must call `json.loads()` on it, (2) append the full assistant `message` object (not just content) including its `tool_calls`, (3) each tool result is its own separate message with `role: 'tool'`, not grouped in one `user` message like Anthropic.",
    starterCode: `from openai import OpenAI
import json
import math

client = OpenAI()  # reads OPENAI_API_KEY from env

# Tool definitions (OpenAI format)
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
                },
                "required": ["location"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate a math expression.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {"type": "string"},
                },
                "required": ["expression"],
            },
        },
    },
]

# --- Reuse tool handlers from agents-003 ---

def handle_get_weather(location, unit="fahrenheit"):
    return json.dumps({"location": location, "temperature": 72, "unit": unit, "condition": "Sunny"})

def handle_calculate(expression):
    try:
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        return str(eval(expression, {"__builtins__": {}}, allowed))
    except Exception as e:
        return f"Error: {e}"

def execute_tool(tool_name, tool_input):
    if tool_name == "get_weather":
        return handle_get_weather(tool_input["location"], tool_input.get("unit", "fahrenheit"))
    elif tool_name == "calculate":
        return handle_calculate(tool_input["expression"])
    return f"Unknown tool: {tool_name}"

# --- OpenAI agent loop ---

def run_agent(user_message, max_iterations=10):
    """
    Run the OpenAI agent loop until finish_reason == 'stop' or max iterations.
    """
    messages = [
        {"role": "system", "content": "You are a helpful assistant with weather and calculator tools."},
        {"role": "user", "content": user_message},
    ]

    for iteration in range(max_iterations):
        # TODO: Call the OpenAI chat completions API

        # TODO: Get finish_reason from response.choices[0]

        # TODO: If finish_reason == 'stop', return the content

        # TODO: If finish_reason == 'tool_calls':
        #   1. Append the assistant message (including tool_calls)
        #   2. For each tool call:
        #      a. Parse arguments (JSON string!) with json.loads
        #      b. Execute the tool
        #      c. Append a 'tool' role message with tool_call_id and result
        pass

    return "Max iterations reached."

if __name__ == "__main__":
    result = run_agent("What's the weather in Paris and what is 99 ** 2?")
    print(result)`,
    solution: `from openai import OpenAI
import json
import math

client = OpenAI()  # reads OPENAI_API_KEY from env

# Tool definitions (OpenAI format)
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location. Use when user asks about weather.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City and country, e.g. 'Paris, France'",
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                    },
                },
                "required": ["location"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Evaluate a mathematical expression.",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Math expression, e.g. '99 ** 2'",
                    },
                },
                "required": ["expression"],
            },
        },
    },
]

# --- Tool handlers ---

def handle_get_weather(location, unit="fahrenheit"):
    return json.dumps({
        "location": location,
        "temperature": 68 if unit == "fahrenheit" else 20,
        "unit": unit,
        "condition": "Partly cloudy",
    })

def handle_calculate(expression):
    try:
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        return str(eval(expression, {"__builtins__": {}}, allowed))
    except Exception as e:
        return f"Error: {e}"

def execute_tool(tool_name, tool_input):
    if tool_name == "get_weather":
        return handle_get_weather(tool_input["location"], tool_input.get("unit", "fahrenheit"))
    elif tool_name == "calculate":
        return handle_calculate(tool_input["expression"])
    return f"Unknown tool: {tool_name}"

# --- OpenAI agent loop ---

def run_agent(user_message, max_iterations=10):
    """
    Run the OpenAI agent loop until finish_reason == 'stop' or max iterations.
    """
    messages = [
        {"role": "system", "content": "You are a helpful assistant with weather and calculator tools."},
        {"role": "user", "content": user_message},
    ]

    for iteration in range(max_iterations):
        # 1. Call the API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
        )

        choice = response.choices[0]
        finish_reason = choice.finish_reason

        # 2. Done — return final text
        if finish_reason == "stop":
            return choice.message.content

        # 3. Tool calls requested
        if finish_reason == "tool_calls":
            # Append the full assistant message (it contains the tool_calls array)
            messages.append(choice.message)

            # Execute each tool call and append individual tool result messages
            for tool_call in choice.message.tool_calls:
                tool_name = tool_call.function.name
                # CRITICAL: arguments is a JSON string, must parse it
                tool_input = json.loads(tool_call.function.arguments)

                result = execute_tool(tool_name, tool_input)

                # Each result is its own 'tool' role message
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,   # Must match the call id
                    "content": result,
                })

    return "Max iterations reached without a final answer."

if __name__ == "__main__":
    result = run_agent("What's the weather in Paris (celsius) and what is 99 ** 2?")
    print(result)`,
    explanation:
      "OpenAI vs Anthropic agent loop differences to memorize: (1) `finish_reason` vs `stop_reason`, (2) `'tool_calls'` vs `'tool_use'`, (3) tool calls live in `choice.message.tool_calls` (a list), not as content blocks, (4) `function.arguments` is a JSON **string** — always call `json.loads()` on it, (5) each tool result is a separate message with `role: 'tool'` and `tool_call_id`, not bundled in a `user` message like Anthropic. The `tool_call_id` must match `tool_call.id` exactly so the model can correlate results to calls.",
    testCases: `# Unit test the dispatch layer
import json

result = execute_tool("calculate", {"expression": "99 ** 2"})
assert result == "9801", f"Expected '9801', got {result}"

result = execute_tool("get_weather", {"location": "Paris, France", "unit": "celsius"})
data = json.loads(result)
assert data["location"] == "Paris, France"
assert data["unit"] == "celsius"

# Simulate parsing arguments as a JSON string (the OpenAI gotcha)
raw_arguments = '{"expression": "10 + 5"}'
parsed = json.loads(raw_arguments)
assert parsed["expression"] == "10 + 5"

result = execute_tool("calculate", parsed)
assert result == "15"

print("All OpenAI agent loop tests passed.")`,
    timeComplexity: "O(iterations * tools_per_turn)",
    spaceComplexity: "O(message_history_length)",
  },

  {
    id: "agents-005",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "core",
    title: "Tool Dispatcher Pattern",
    tags: ["dispatch", "registry", "tool-execution", "error-handling"],
    question:
      "Implement a **tool dispatcher** using a registry pattern.\n\nRequirements:\n- A `ToolRegistry` class with `register(name, handler, schema)` method\n- A `dispatch(tool_name, tool_input)` method that routes to the correct handler\n- Graceful error handling for unknown tools and handler exceptions\n- A `get_tool_definitions()` method that returns all registered tools in Anthropic format\n- Register the weather and calculator tools using a decorator pattern\n\nThis pattern is more maintainable than a long `if/elif` chain when you have many tools.",
    hint: "Use a dict to store `name -> (handler, schema)` pairs. The decorator approach lets you use `@registry.tool(name, description, schema)` to register functions cleanly. `dispatch` should catch all exceptions and return a formatted error string rather than raising — the error message goes back to the LLM as a tool_result.",
    starterCode: `import json
import math

class ToolRegistry:
    def __init__(self):
        self._tools = {}  # name -> {"handler": fn, "schema": dict}

    def register(self, name, handler, description, input_schema):
        """Register a tool handler with its schema."""
        # TODO: Store handler and build Anthropic-format tool definition
        pass

    def tool(self, name, description, input_schema):
        """Decorator for registering tool handlers."""
        # TODO: Return a decorator that calls self.register
        pass

    def dispatch(self, tool_name, tool_input):
        """
        Execute a tool by name with given inputs.
        Returns a string result (or error message for unknown/failed tools).
        """
        # TODO: Look up the handler, call it, return string result
        # Handle unknown tools and exceptions gracefully
        pass

    def get_tool_definitions(self):
        """Return all tool definitions in Anthropic format."""
        # TODO: Return list of {name, description, input_schema} dicts
        pass


# Create registry instance
registry = ToolRegistry()

# TODO: Register weather tool using the decorator
# @registry.tool("get_weather", "Get weather for a location", {...})
# def get_weather(location, unit="fahrenheit"):
#     ...

# TODO: Register calculator tool using the decorator
# @registry.tool("calculate", "Evaluate a math expression", {...})
# def calculate(expression):
#     ...`,
    solution: `import json
import math
from functools import wraps

class ToolRegistry:
    def __init__(self):
        self._tools = {}  # name -> {"handler": fn, "definition": dict}

    def register(self, name, handler, description, input_schema):
        """Register a tool handler with its schema."""
        self._tools[name] = {
            "handler": handler,
            "definition": {
                "name": name,
                "description": description,
                "input_schema": input_schema,
            },
        }

    def tool(self, name, description, input_schema):
        """Decorator for registering tool handlers."""
        def decorator(fn):
            self.register(name, fn, description, input_schema)
            @wraps(fn)
            def wrapper(*args, **kwargs):
                return fn(*args, **kwargs)
            return wrapper
        return decorator

    def dispatch(self, tool_name, tool_input):
        """
        Execute a tool by name with given inputs.
        Returns a string result (or error message for unknown/failed tools).
        """
        if tool_name not in self._tools:
            return f"Error: Unknown tool '{tool_name}'. Available tools: {list(self._tools.keys())}"

        handler = self._tools[tool_name]["handler"]
        try:
            result = handler(**tool_input)
            # Ensure result is always a string
            return result if isinstance(result, str) else json.dumps(result)
        except TypeError as e:
            return f"Error: Invalid arguments for '{tool_name}': {e}"
        except Exception as e:
            return f"Error executing '{tool_name}': {type(e).__name__}: {e}"

    def get_tool_definitions(self):
        """Return all tool definitions in Anthropic format."""
        return [entry["definition"] for entry in self._tools.values()]


# Create registry instance
registry = ToolRegistry()

@registry.tool(
    name="get_weather",
    description="Get the current weather for a location. Use when the user asks about weather.",
    input_schema={
        "type": "object",
        "properties": {
            "location": {"type": "string", "description": "City, e.g. 'Tokyo, Japan'"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
        },
        "required": ["location"],
    },
)
def get_weather(location, unit="fahrenheit"):
    temp = 72 if unit == "fahrenheit" else 22
    return json.dumps({"location": location, "temperature": temp, "unit": unit, "condition": "Sunny"})

@registry.tool(
    name="calculate",
    description="Evaluate a math expression. Use for numeric computations.",
    input_schema={
        "type": "object",
        "properties": {
            "expression": {"type": "string", "description": "Math expression, e.g. '2 ** 10'"},
        },
        "required": ["expression"],
    },
)
def calculate(expression):
    try:
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        return str(eval(expression, {"__builtins__": {}}, allowed))
    except Exception as e:
        return f"Math error: {e}"`,
    explanation:
      "The registry pattern separates tool definition from dispatch logic. Each tool is registered once with its handler and schema. The `dispatch` method provides a single entry point that handles unknown tools and exceptions — returning error strings rather than raising, because tool errors should be communicated back to the LLM as information, not crash the agent. The decorator pattern makes registering new tools ergonomic: just add `@registry.tool(...)` above the function. `get_tool_definitions()` auto-generates the tools list for the API call.",
    testCases: `# Test dispatch
result = registry.dispatch("calculate", {"expression": "2 ** 10"})
assert result == "1024", f"Got {result}"

result = registry.dispatch("get_weather", {"location": "Tokyo", "unit": "celsius"})
import json
data = json.loads(result)
assert data["location"] == "Tokyo"

# Test unknown tool
result = registry.dispatch("unknown_tool", {})
assert "Unknown tool" in result

# Test bad arguments
result = registry.dispatch("calculate", {"wrong_key": "2 + 2"})
assert "Error" in result

# Test tool definitions
definitions = registry.get_tool_definitions()
assert len(definitions) == 2
names = [d["name"] for d in definitions]
assert "get_weather" in names
assert "calculate" in names
assert all("input_schema" in d for d in definitions)

print("All registry tests passed.")`,
    timeComplexity: "O(1) per dispatch",
    spaceComplexity: "O(n) where n = number of registered tools",
  },

  {
    id: "agents-006",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "standard",
    title: "System Prompt Construction",
    tags: ["system-prompt", "prompt-engineering", "persona", "guardrails"],
    question:
      "Implement a `build_system_prompt(config)` function that constructs a structured system prompt for an agent.\n\nThe prompt must include these sections (in order):\n1. **Persona** — who the agent is and its tone\n2. **Task Instructions** — what the agent is supposed to do\n3. **Available Tools** — a human-readable summary of each tool (name + when to use it)\n4. **Output Format** — how the agent should structure its final response\n5. **Guardrails** — things the agent must never do\n\nThe function takes a `config` dict and a list of tool definitions, and returns the assembled prompt string.",
    hint: "Use a list of sections and join them with double newlines. For the tools section, iterate the tool definitions and extract `name` and `description`. Guardrails should always include refusing to execute arbitrary code, never making up data when a tool should be called, and respecting the output format.",
    starterCode: `def build_system_prompt(config, tool_definitions):
    """
    Build a structured system prompt for an agent.

    Args:
        config: dict with keys:
            - persona: str — agent's identity/role
            - task: str — what the agent should accomplish
            - output_format: str — how to structure the response
            - guardrails: list[str] — things to never do
        tool_definitions: list of dicts with 'name' and 'description'

    Returns:
        str — the complete system prompt
    """
    sections = []

    # TODO: Add Persona section

    # TODO: Add Task Instructions section

    # TODO: Add Available Tools section (list each tool's name + description)

    # TODO: Add Output Format section

    # TODO: Add Guardrails section

    return "\\n\\n".join(sections)


# Example usage
config = {
    "persona": "You are a research assistant named Atlas. You are precise, concise, and always cite your sources.",
    "task": "Help users research topics by searching the web, fetching pages, and summarizing findings.",
    "output_format": "Always end with a ## Summary section. Use markdown for structure.",
    "guardrails": [
        "Never fabricate URLs or citations.",
        "If a tool fails, tell the user and explain why.",
        "Do not make more than 5 tool calls per user request.",
    ],
}

sample_tools = [
    {"name": "web_search", "description": "Search the web for current information."},
    {"name": "fetch_page", "description": "Fetch and read the content of a URL."},
    {"name": "summarize", "description": "Summarize a long piece of text."},
]`,
    solution: `def build_system_prompt(config, tool_definitions):
    """
    Build a structured system prompt for an agent.
    """
    sections = []

    # 1. Persona
    sections.append(f"## Persona\\n{config['persona']}")

    # 2. Task Instructions
    sections.append(f"## Task Instructions\\n{config['task']}")

    # 3. Available Tools
    if tool_definitions:
        tool_lines = []
        for tool in tool_definitions:
            name = tool["name"]
            description = tool.get("description", "No description provided.")
            tool_lines.append(f"- **{name}**: {description}")
        tools_section = "## Available Tools\\n" + "\\n".join(tool_lines)
        sections.append(tools_section)
    else:
        sections.append("## Available Tools\\nNo tools available.")

    # 4. Output Format
    sections.append(f"## Output Format\\n{config['output_format']}")

    # 5. Guardrails
    guardrails = config.get("guardrails", [])
    if guardrails:
        guardrail_lines = "\\n".join(f"- {rule}" for rule in guardrails)
        sections.append(f"## Guardrails\\nYou must NEVER:\\n{guardrail_lines}")
    else:
        sections.append("## Guardrails\\nAlways be helpful, harmless, and honest.")

    return "\\n\\n".join(sections)


# Example usage
config = {
    "persona": "You are a research assistant named Atlas. You are precise, concise, and always cite your sources.",
    "task": "Help users research topics by searching the web, fetching pages, and summarizing findings.",
    "output_format": "Always end with a ## Summary section. Use markdown for structure.",
    "guardrails": [
        "Never fabricate URLs or citations.",
        "If a tool fails, tell the user and explain why.",
        "Do not make more than 5 tool calls per user request.",
    ],
}

sample_tools = [
    {"name": "web_search", "description": "Search the web for current information."},
    {"name": "fetch_page", "description": "Fetch and read the content of a URL."},
    {"name": "summarize", "description": "Summarize a long piece of text."},
]

if __name__ == "__main__":
    prompt = build_system_prompt(config, sample_tools)
    print(prompt)`,
    explanation:
      "A well-structured system prompt is one of the highest-leverage engineering decisions in an agent. The five sections serve distinct purposes: Persona anchors tone and identity; Task Instructions define the mission; Available Tools gives the model a human-readable index of its capabilities (even though it sees the JSON schema, a prose description improves routing decisions); Output Format reduces post-processing work; Guardrails reduce failure modes. Double-newline separation between sections improves readability for both the model and developers debugging prompts.",
    testCases: `prompt = build_system_prompt(config, sample_tools)

# All 5 sections must appear
assert "## Persona" in prompt
assert "## Task Instructions" in prompt
assert "## Available Tools" in prompt
assert "## Output Format" in prompt
assert "## Guardrails" in prompt

# Tools listed
assert "web_search" in prompt
assert "fetch_page" in prompt
assert "summarize" in prompt

# Config content appears
assert "Atlas" in prompt
assert "Summary section" in prompt
assert "Never fabricate URLs" in prompt

# Empty tools case
empty_prompt = build_system_prompt(config, [])
assert "No tools available" in empty_prompt

print("All system prompt tests passed.")`,
    timeComplexity: "O(n) where n = number of tools",
    spaceComplexity: "O(prompt_length)",
  },

  {
    id: "agents-007",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "standard",
    title: "Message History Management",
    tags: ["context-window", "message-history", "windowing", "tool-pairs"],
    question:
      "Implement a `MessageHistory` class that manages conversation history within a token/message budget.\n\nRequirements:\n- Store messages in a list\n- `add_user(content)` and `add_assistant(content)` and `add_tool_result(tool_use_id, content)` methods\n- `get_windowed(max_messages)` — return the last N messages, but **never split a tool call/result pair**. If truncation would separate a `tool_use` from its `tool_result`, cut the entire pair.\n- `summarize_older(keep_last_n)` — conceptually explain how you would summarize older messages (stub implementation that just drops them)\n- The first message (user's initial request) should always be preserved\n\nThe key insight: tool call/result pairs are **atomic** — you can't include the assistant's `tool_use` without the subsequent `tool_result` or the model gets confused.",
    hint: "When windowing, scan backward from the end collecting messages. When you encounter a `tool_result` message, you must also include the preceding assistant message that contains the corresponding `tool_use`. Use the `tool_use_id` to verify the pairing. Alternatively, track pairs explicitly when adding messages.",
    starterCode: `class MessageHistory:
    def __init__(self):
        self.messages = []

    def add_user(self, content):
        """Add a user message."""
        # TODO
        pass

    def add_assistant(self, content):
        """Add an assistant message (may contain tool_use blocks as a list)."""
        # TODO
        pass

    def add_tool_results(self, tool_results):
        """
        Add tool results as a user message with role='user' (Anthropic format).
        tool_results: list of {type: 'tool_result', tool_use_id: ..., content: ...}
        """
        # TODO
        pass

    def get_windowed(self, max_messages=20):
        """
        Return the last max_messages messages.
        Always include the first message.
        Never split a tool call / tool result pair.
        """
        # TODO
        pass

    def summarize_older(self, keep_last_n=10):
        """
        Drop older messages, keeping the first and last keep_last_n.
        In production: call LLM to summarize dropped messages and prepend summary.
        """
        # TODO
        pass

    def __len__(self):
        return len(self.messages)`,
    solution: `class MessageHistory:
    def __init__(self):
        self.messages = []

    def add_user(self, content):
        """Add a user message."""
        self.messages.append({"role": "user", "content": content})

    def add_assistant(self, content):
        """Add an assistant message (content can be str or list of content blocks)."""
        self.messages.append({"role": "assistant", "content": content})

    def add_tool_results(self, tool_results):
        """
        Add tool results as a user message (Anthropic format).
        tool_results: list of {type: 'tool_result', tool_use_id: ..., content: ...}
        """
        self.messages.append({"role": "user", "content": tool_results})

    def _is_tool_result_message(self, message):
        """Check if a message is a tool result (user message with tool_result blocks)."""
        content = message.get("content", "")
        if isinstance(content, list):
            return any(
                isinstance(block, dict) and block.get("type") == "tool_result"
                for block in content
            )
        return False

    def _is_tool_use_message(self, message):
        """Check if an assistant message contains tool_use blocks."""
        content = message.get("content", "")
        if isinstance(content, list):
            return any(
                hasattr(block, "type") and block.type == "tool_use"
                or isinstance(block, dict) and block.get("type") == "tool_use"
                for block in content
            )
        return False

    def get_windowed(self, max_messages=20):
        """
        Return the last max_messages messages.
        Always includes the first message.
        Never splits a tool call / tool result pair.
        """
        if len(self.messages) <= max_messages:
            return self.messages.copy()

        # Always keep the first message
        first_message = self.messages[0]
        remaining = self.messages[1:]

        # Take last (max_messages - 1) messages, but don't split pairs
        window = remaining[-(max_messages - 1):]

        # If the first message in our window is a tool_result,
        # the paired tool_use was cut off — remove it too
        while window and self._is_tool_result_message(window[0]):
            window = window[1:]

        return [first_message] + window

    def summarize_older(self, keep_last_n=10):
        """
        Drop older messages, keeping the first and last keep_last_n.

        Production version: call LLM to summarize dropped messages,
        then prepend: {"role": "user", "content": f"[Summary of earlier conversation]: {summary}"}
        """
        if len(self.messages) <= keep_last_n + 1:
            return  # Nothing to drop

        first_message = self.messages[0]
        recent = self.messages[-keep_last_n:]

        # In production: summarize self.messages[1:-keep_last_n] via LLM
        # dropped = self.messages[1:-keep_last_n]
        # summary = call_llm_to_summarize(dropped)
        # summary_msg = {"role": "user", "content": f"[Conversation summary]: {summary}"}
        # self.messages = [first_message, summary_msg] + recent

        # Stub: just drop the old messages
        self.messages = [first_message] + recent

    def __len__(self):
        return len(self.messages)`,
    explanation:
      "Message history management is critical for long-running agents. The key constraint is that tool call/result pairs are atomic — if you include the assistant's `tool_use` you must include the corresponding `tool_result`, or the model sees an incomplete conversation and may hallucinate. The windowing strategy: take the last N messages, then scan from the front of the window and drop any orphaned `tool_result` messages (whose paired `tool_use` was cut off). In production, `summarize_older` would call an LLM to compress the dropped context into a summary message, preserving key information while reducing token usage.",
    testCases: `history = MessageHistory()
history.add_user("What is the weather in Tokyo?")
history.add_assistant([{"type": "tool_use", "id": "tu_1", "name": "get_weather", "input": {"location": "Tokyo"}}])
history.add_tool_results([{"type": "tool_result", "tool_use_id": "tu_1", "content": "72F, Sunny"}])
history.add_assistant("The weather in Tokyo is 72°F and sunny.")
history.add_user("Thanks!")

assert len(history) == 5

# Windowing: get all 5 (within limit)
windowed = history.get_windowed(max_messages=10)
assert len(windowed) == 5

# Windowing: trim to 3 — should keep first + last 2
windowed = history.get_windowed(max_messages=3)
assert windowed[0]["role"] == "user"  # first message always preserved
assert len(windowed) <= 3

# Summarize older
history2 = MessageHistory()
for i in range(20):
    history2.add_user(f"Message {i}")
history2.summarize_older(keep_last_n=5)
assert len(history2) <= 7  # first + 5 recent + possible summary

print("All message history tests passed.")`,
    timeComplexity: "O(n) for windowing",
    spaceComplexity: "O(n) for stored messages",
  },

  {
    id: "agents-008",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "standard",
    title: "Multi-Tool Orchestration",
    tags: ["orchestration", "chaining", "search", "fetch", "summarize"],
    question:
      "Implement an agent that **chains three tools in sequence**:\n1. `web_search(query)` — returns a list of URLs\n2. `fetch_page(url)` — returns the page content\n3. `summarize(text)` — returns a summary\n\nThe agent should:\n- Call `web_search` first to find relevant URLs\n- Call `fetch_page` on the top result\n- Call `summarize` on the page content\n- Return the final summary\n\nShow the **complete message flow** — all messages appended to the conversation, including how tool results feed into the next tool call. Use the Anthropic SDK format.",
    hint: "The model decides the order of tool calls based on the system prompt. Your job is to implement the tool handlers and the agent loop, then trust the model to chain them correctly. The key is making tool descriptions clear about their inputs/outputs so the model knows to use search results as input to fetch_page.",
    starterCode: `import anthropic
import json

client = anthropic.Anthropic()

# Mock tool implementations (in production, call real APIs)

def web_search(query):
    """Returns a list of search results."""
    # TODO: Mock implementation returning URLs
    pass

def fetch_page(url):
    """Returns the text content of a URL."""
    # TODO: Mock implementation returning page content
    pass

def summarize(text, max_words=100):
    """Returns a summary of the text."""
    # TODO: Mock implementation (in production, this might call another LLM)
    pass

# Tool definitions
tools = [
    # TODO: Define web_search tool
    # TODO: Define fetch_page tool
    # TODO: Define summarize tool
]

def execute_tool(name, inputs):
    # TODO: Dispatch to correct handler
    pass

def run_research_agent(topic, max_iterations=10):
    """
    Research a topic by chaining search -> fetch -> summarize.
    Returns the final summary.
    """
    # TODO: Implement the agent loop
    pass`,
    solution: `import anthropic
import json

client = anthropic.Anthropic()

# Mock tool implementations

def web_search(query):
    """Returns a list of search results with titles and URLs."""
    # Mock: in production, call SerpAPI, Bing API, or similar
    return json.dumps([
        {"title": f"Introduction to {query}", "url": f"https://example.com/{query.replace(' ', '-')}-intro"},
        {"title": f"{query} - Deep Dive", "url": f"https://docs.example.com/{query.replace(' ', '-')}"},
        {"title": f"Latest {query} news", "url": f"https://news.example.com/{query.replace(' ', '-')}"},
    ])

def fetch_page(url):
    """Returns the text content of a URL."""
    # Mock: in production, use requests + BeautifulSoup or a headless browser
    return (
        f"This is the full text content of the page at {url}. "
        "It contains detailed information about the requested topic, "
        "including background, current developments, and expert analysis. "
        "The article is approximately 2000 words covering all major aspects."
    )

def summarize(text, max_words="100"):
    """Returns a concise summary of the text."""
    # Mock: in production, this could call another LLM or use extractive summarization
    word_limit = int(max_words)
    words = text.split()[:word_limit]
    return " ".join(words) + "... [summarized]"

def execute_tool(name, inputs):
    """Dispatch tool call to the correct handler."""
    dispatch = {
        "web_search": lambda i: web_search(i["query"]),
        "fetch_page": lambda i: fetch_page(i["url"]),
        "summarize": lambda i: summarize(i["text"], i.get("max_words", "100")),
    }
    if name not in dispatch:
        return f"Unknown tool: {name}"
    try:
        return dispatch[name](inputs)
    except Exception as e:
        return f"Tool error ({name}): {e}"

# Tool definitions
tools = [
    {
        "name": "web_search",
        "description": (
            "Search the web for information about a topic. "
            "Returns a list of relevant URLs and titles. "
            "Use this FIRST to find sources before fetching content."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The search query"},
            },
            "required": ["query"],
        },
    },
    {
        "name": "fetch_page",
        "description": (
            "Fetch and return the full text content of a URL. "
            "Use this AFTER web_search to read the content of a specific page."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "The URL to fetch"},
            },
            "required": ["url"],
        },
    },
    {
        "name": "summarize",
        "description": (
            "Summarize a long piece of text into a concise overview. "
            "Use this AFTER fetch_page to condense the page content."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "The text to summarize"},
                "max_words": {"type": "string", "description": "Maximum words in summary (default 100)"},
            },
            "required": ["text"],
        },
    },
]

def run_research_agent(topic, max_iterations=10):
    """
    Research a topic by chaining: web_search -> fetch_page -> summarize.
    Returns the final summary from the model.
    """
    system = (
        "You are a research agent. To answer research questions, always follow this sequence: "
        "1) Use web_search to find relevant URLs, "
        "2) Use fetch_page on the most relevant URL, "
        "3) Use summarize to condense the content, "
        "4) Provide your final answer based on the summary."
    )
    messages = [{"role": "user", "content": f"Research this topic and give me a summary: {topic}"}]

    for iteration in range(max_iterations):
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=4096,
            system=system,
            messages=messages,
            tools=tools,
        )

        if response.stop_reason == "end_turn":
            for block in response.content:
                if block.type == "text":
                    return block.text
            return ""

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    print(f"  -> Calling {block.name} with {block.input}")
                    result = execute_tool(block.name, block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            messages.append({"role": "user", "content": tool_results})

    return "Research incomplete: max iterations reached."

if __name__ == "__main__":
    summary = run_research_agent("large language models and tool use")
    print(summary)`,
    explanation:
      "Multi-tool chaining works because the system prompt instructs the model to use tools in order, and each tool's description specifies when to use it relative to others ('Use AFTER web_search'). The message flow: (1) user asks about topic, (2) model calls `web_search`, (3) we return URLs, (4) model calls `fetch_page` with a URL from the search results, (5) we return page content, (6) model calls `summarize` with the page content, (7) we return the summary, (8) model produces a final text response. The model orchestrates this sequence autonomously — your job is correct tool descriptions and a complete agent loop.",
    testCases: `# Test tool chain individually
import json

# web_search returns URLs
results = json.loads(web_search("AI agents"))
assert len(results) > 0
assert "url" in results[0]
assert "title" in results[0]

# fetch_page returns text
content = fetch_page(results[0]["url"])
assert isinstance(content, str)
assert len(content) > 0

# summarize condenses text
summary = summarize(content, "20")
assert isinstance(summary, str)

# execute_tool dispatch
result = execute_tool("web_search", {"query": "test"})
assert isinstance(result, str)

result = execute_tool("unknown", {})
assert "Unknown tool" in result

print("All multi-tool orchestration tests passed.")`,
    timeComplexity: "O(iterations * tools_per_turn)",
    spaceComplexity: "O(message_history + page_content)",
  },

  {
    id: "agents-009",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "standard",
    title: "Error Handling in Tool Execution",
    tags: ["retry", "exponential-backoff", "timeout", "error-handling", "resilience"],
    question:
      "Implement a `robust_tool_executor` that wraps tool calls with:\n1. **Timeout handling** — cancel tools that run longer than `timeout_seconds`\n2. **Retry with exponential backoff** — retry up to `max_retries` times on transient errors\n3. **Error classification** — distinguish retryable errors (network, timeout) from permanent errors (invalid input, unknown tool)\n4. **Graceful error messages** — return descriptive error strings to the LLM, not exceptions\n\nAlso implement a `ToolError` exception hierarchy: `PermanentToolError` (do not retry) and `TransientToolError` (do retry).",
    hint: "Use `concurrent.futures.ThreadPoolExecutor` with a timeout for the timeout handling. Exponential backoff: `wait = base_delay * (2 ** attempt)`. Add jitter to avoid thundering herd: `wait += random.uniform(0, 1)`. Permanent errors (wrong args, unknown tool) should be returned immediately without retrying.",
    starterCode: `import time
import random
import concurrent.futures
from typing import Callable, Any

class ToolError(Exception):
    """Base class for tool errors."""
    pass

class PermanentToolError(ToolError):
    """Non-retryable error: wrong arguments, unknown tool, etc."""
    pass

class TransientToolError(ToolError):
    """Retryable error: network failure, timeout, rate limit, etc."""
    pass

def robust_tool_executor(
    tool_fn: Callable,
    tool_input: dict,
    tool_name: str,
    max_retries: int = 3,
    timeout_seconds: float = 10.0,
    base_delay: float = 1.0,
) -> str:
    """
    Execute a tool with retry logic, timeout, and graceful error handling.

    Returns a string result or a descriptive error message.
    Never raises — all errors become informative string messages for the LLM.
    """
    # TODO: Implement retry loop with exponential backoff + jitter

    # TODO: Implement timeout using ThreadPoolExecutor

    # TODO: Handle PermanentToolError (no retry)

    # TODO: Handle TransientToolError (retry with backoff)

    # TODO: Handle TimeoutError

    # TODO: Handle unexpected exceptions
    pass


# Example tool that can fail transiently
def flaky_weather_tool(location: str, unit: str = "fahrenheit") -> str:
    """Simulates a tool that sometimes fails with network errors."""
    import random
    if random.random() < 0.5:
        raise TransientToolError(f"Network timeout reaching weather API for {location}")
    return f"Weather in {location}: 72{unit[0].upper()}, Sunny"`,
    solution: `import time
import random
import concurrent.futures
from typing import Callable, Any

class ToolError(Exception):
    """Base class for tool errors."""
    pass

class PermanentToolError(ToolError):
    """Non-retryable error: wrong arguments, unknown tool, invalid input."""
    pass

class TransientToolError(ToolError):
    """Retryable error: network failure, timeout, rate limit, service unavailable."""
    pass

def robust_tool_executor(
    tool_fn: Callable,
    tool_input: dict,
    tool_name: str,
    max_retries: int = 3,
    timeout_seconds: float = 10.0,
    base_delay: float = 1.0,
) -> str:
    """
    Execute a tool with retry logic, timeout, and graceful error handling.

    Returns a string result or a descriptive error message.
    Never raises — all errors become informative string messages for the LLM.
    """
    last_error = None

    for attempt in range(max_retries + 1):  # attempt 0 = first try
        try:
            # Run the tool with a timeout
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(tool_fn, **tool_input)
                try:
                    result = future.result(timeout=timeout_seconds)
                    # Success — return the result as a string
                    return result if isinstance(result, str) else str(result)
                except concurrent.futures.TimeoutError:
                    future.cancel()
                    raise TransientToolError(
                        f"Tool '{tool_name}' timed out after {timeout_seconds}s"
                    )

        except PermanentToolError as e:
            # Do NOT retry permanent errors — return immediately
            return (
                f"Tool '{tool_name}' failed with a permanent error and cannot be retried: {e}. "
                "Please check your inputs or try a different approach."
            )

        except TransientToolError as e:
            last_error = e
            if attempt < max_retries:
                # Exponential backoff with jitter
                wait = base_delay * (2 ** attempt) + random.uniform(0, 1.0)
                time.sleep(wait)
                continue  # retry
            else:
                # Out of retries
                return (
                    f"Tool '{tool_name}' failed after {max_retries + 1} attempts. "
                    f"Last error: {last_error}. "
                    "This appears to be a temporary issue — please try again later."
                )

        except TypeError as e:
            # Wrong arguments — permanent error
            return (
                f"Tool '{tool_name}' received invalid arguments: {e}. "
                "Please check the tool's required parameters."
            )

        except Exception as e:
            # Unexpected error — treat as transient and retry
            last_error = e
            if attempt < max_retries:
                wait = base_delay * (2 ** attempt) + random.uniform(0, 1.0)
                time.sleep(wait)
            else:
                return (
                    f"Tool '{tool_name}' encountered an unexpected error: "
                    f"{type(e).__name__}: {e}. The tool could not complete the request."
                )

    return f"Tool '{tool_name}' failed: {last_error}"


# Example tool that can fail transiently
def flaky_weather_tool(location: str, unit: str = "fahrenheit") -> str:
    """Simulates a tool that sometimes fails with network errors."""
    if random.random() < 0.3:  # 30% failure rate for testing
        raise TransientToolError(f"Network timeout reaching weather API for {location}")
    return f"Weather in {location}: 72{unit[0].upper()}, Sunny"


# Example tool with permanent error on bad input
def strict_calculator(expression: str) -> str:
    """Calculator that raises PermanentToolError on invalid input."""
    import math
    if not isinstance(expression, str) or len(expression) > 100:
        raise PermanentToolError("Expression must be a string under 100 characters")
    try:
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        return str(eval(expression, {"__builtins__": {}}, allowed))
    except SyntaxError as e:
        raise PermanentToolError(f"Invalid expression syntax: {e}")`,
    explanation:
      "Robust tool execution requires distinguishing error types. `PermanentToolError` (bad input, unknown tool) should never be retried — the same call will always fail. `TransientToolError` (network, timeout, rate limit) should be retried with exponential backoff and jitter. Jitter (random delay offset) prevents the 'thundering herd' problem where all agents retry simultaneously after a service recovers. The timeout pattern uses `ThreadPoolExecutor.submit().result(timeout=N)` — the cleanest way to add timeouts to synchronous Python functions. Critically, `robust_tool_executor` never raises — it always returns a descriptive string, because the LLM needs to read the error to decide what to do next.",
    testCases: `import random
random.seed(42)

# Test successful execution
def always_succeeds(x):
    return f"Result: {x}"

result = robust_tool_executor(always_succeeds, {"x": "hello"}, "test_tool")
assert result == "Result: hello", f"Got: {result}"

# Test permanent error (no retry)
def always_permanent(x):
    raise PermanentToolError("Bad input")

result = robust_tool_executor(always_permanent, {"x": "bad"}, "test_tool", max_retries=3)
assert "permanent error" in result.lower()

# Test timeout
def slow_tool(x):
    time.sleep(5)
    return "done"

result = robust_tool_executor(slow_tool, {"x": "test"}, "slow_tool", timeout_seconds=0.1, max_retries=0)
assert "timed out" in result.lower() or "failed" in result.lower()

# Test that errors return strings (not exceptions)
def explodes(**kwargs):
    raise RuntimeError("Boom")

result = robust_tool_executor(explodes, {}, "exploder", max_retries=1, base_delay=0.01)
assert isinstance(result, str)

print("All error handling tests passed.")`,
    timeComplexity: "O(max_retries) with exponential backoff delays",
    spaceComplexity: "O(1)",
  },

  {
    id: "agents-011",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "stretch",
    title: "ReAct Pattern Implementation",
    tags: ["ReAct", "chain-of-thought", "reasoning", "scratchpad", "thought-action-observation"],
    question:
      "Implement the **ReAct (Reasoning + Acting)** pattern.\n\nReAct structures agent output as alternating:\n- **Thought:** The model's reasoning about what to do next\n- **Action:** A tool call or final answer\n- **Observation:** The tool result\n\nYour implementation should:\n1. Parse the model's output for `Thought:`, `Action:`, and `Final Answer:` markers\n2. Maintain a `scratchpad` of all thoughts and observations\n3. Execute the action when found\n4. Inject the observation back into the prompt\n5. Stop when `Final Answer:` is detected\n\nUse a **single text completion** (no structured tool use) — the model outputs its reasoning as text and you parse it.\n\n**Example model output:**\n```\nThought: I need to find the weather in Tokyo first.\nAction: get_weather(location='Tokyo', unit='celsius')\nObservation: (you fill this in)\nThought: Now I have the temperature, I can answer.\nFinal Answer: The weather in Tokyo is 22C and sunny.\n```",
    hint: "Use regex to parse the model output. Look for `Action:` lines and parse the function call format. Build the scratchpad by concatenating `Thought + Action + Observation` blocks. Inject the scratchpad into the next prompt so the model can continue its chain of reasoning. Stop when you detect `Final Answer:` in the output.",
    starterCode: `import re
import anthropic

client = anthropic.Anthropic()

# Available tools (plain Python functions, not API tool definitions)
def get_weather(location, unit="celsius"):
    return f"72°{unit[0].upper()}, Sunny, humidity 65%"

def calculate(expression):
    import math
    try:
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        return str(eval(expression, {"__builtins__": {}}, allowed))
    except Exception as e:
        return f"Error: {e}"

TOOL_REGISTRY = {
    "get_weather": get_weather,
    "calculate": calculate,
}

def parse_action(action_text):
    """
    Parse an action string like:
      'get_weather(location="Tokyo", unit="celsius")'
    Returns (tool_name, kwargs_dict) or (None, None) if not parseable.
    """
    # TODO: Use regex to extract function name and arguments
    pass

def execute_action(action_text):
    """Parse and execute the action. Returns observation string."""
    # TODO: Call parse_action, then look up in TOOL_REGISTRY, then execute
    pass

REACT_SYSTEM_PROMPT = """You are a ReAct agent. For every question, reason step by step using this exact format:

Thought: <your reasoning about what to do>
Action: <tool_name(arg1="val1", arg2="val2")>
Observation: <you will see the result here>
... (repeat Thought/Action/Observation as needed)
Thought: <reasoning about the final answer>
Final Answer: <your complete answer to the user>

Available tools:
- get_weather(location, unit): Get weather for a city
- calculate(expression): Evaluate a math expression

IMPORTANT: Always use exactly these format markers. Never skip Thought before Action."""

def run_react_agent(question, max_iterations=8):
    """
    Run the ReAct loop until Final Answer is found.
    Returns the final answer string.
    """
    scratchpad = ""
    # TODO: Implement the ReAct loop
    pass`,
    solution: `import re
import anthropic

client = anthropic.Anthropic()

# Available tools (plain Python functions)
def get_weather(location, unit="celsius"):
    return f"22°C, Sunny, humidity 65%" if unit == "celsius" else f"72°F, Sunny, humidity 65%"

def calculate(expression):
    import math
    try:
        allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
        return str(eval(expression, {"__builtins__": {}}, allowed))
    except Exception as e:
        return f"Error: {e}"

TOOL_REGISTRY = {
    "get_weather": get_weather,
    "calculate": calculate,
}

def parse_action(action_text):
    """
    Parse 'tool_name(arg1="val1", arg2="val2")' into (name, kwargs).
    Returns (None, None) if parsing fails.
    """
    action_text = action_text.strip()
    # Match: tool_name(...)
    match = re.match(r'(\\w+)\\((.*)\\)$', action_text, re.DOTALL)
    if not match:
        return None, None

    tool_name = match.group(1)
    args_str = match.group(2).strip()

    if not args_str:
        return tool_name, {}

    # Parse keyword arguments: key="value" or key='value' or key=value
    kwargs = {}
    # Match key=value pairs (handles quoted and unquoted values)
    pattern = r'(\\w+)=(?:"([^"]*)"|\'([^\']*)\'|(\\S+?)(?:,|$))'
    for m in re.finditer(pattern, args_str):
        key = m.group(1)
        value = m.group(2) or m.group(3) or m.group(4)
        if value:
            kwargs[key] = value.strip().rstrip(',').strip()

    return tool_name, kwargs

def execute_action(action_text):
    """Parse and execute the action. Returns observation string."""
    tool_name, kwargs = parse_action(action_text)
    if tool_name is None:
        return f"Could not parse action: '{action_text}'. Use format: tool_name(arg='value')"
    if tool_name not in TOOL_REGISTRY:
        return f"Unknown tool: '{tool_name}'. Available: {list(TOOL_REGISTRY.keys())}"
    try:
        return TOOL_REGISTRY[tool_name](**kwargs)
    except Exception as e:
        return f"Tool error: {e}"

REACT_SYSTEM_PROMPT = """You are a ReAct agent. For every question, reason step by step using this exact format:

Thought: <your reasoning about what to do>
Action: <tool_name(arg1="val1", arg2="val2")>
Observation: <you will see the result here>
... (repeat Thought/Action/Observation as needed)
Thought: <reasoning about the final answer>
Final Answer: <your complete answer to the user>

Available tools:
- get_weather(location, unit): Get weather for a city. unit is 'celsius' or 'fahrenheit'
- calculate(expression): Evaluate a math expression, e.g. calculate(expression="2 + 2")

IMPORTANT: Use exactly these format markers. Never skip Thought before Action."""

def run_react_agent(question, max_iterations=8):
    """
    Run the ReAct loop until Final Answer is found.
    Returns the final answer string.
    """
    scratchpad = ""

    for iteration in range(max_iterations):
        # Build prompt including the accumulated scratchpad
        if scratchpad:
            user_content = f"Question: {question}\\n\\n{scratchpad}"
        else:
            user_content = f"Question: {question}"

        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            system=REACT_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_content}],
        )

        output = response.content[0].text

        # Check for Final Answer
        final_match = re.search(r'Final Answer:\\s*(.+)', output, re.DOTALL)
        if final_match:
            return final_match.group(1).strip()

        # Extract Action from the output
        action_match = re.search(r'Action:\\s*(.+?)(?:\\n|$)', output)
        if not action_match:
            # No action found, append output and continue
            scratchpad += output + "\\n"
            continue

        action_text = action_match.group(1).strip()
        observation = execute_action(action_text)

        # Extract Thought for the scratchpad
        thought_match = re.search(r'Thought:\\s*(.+?)(?:\\nAction:|$)', output, re.DOTALL)
        thought_text = thought_match.group(1).strip() if thought_match else "(no thought)"

        # Append this step to the scratchpad
        scratchpad += (
            f"Thought: {thought_text}\\n"
            f"Action: {action_text}\\n"
            f"Observation: {observation}\\n"
        )

    return "ReAct agent: max iterations reached without a final answer."

if __name__ == "__main__":
    answer = run_react_agent("What is the weather in Tokyo in celsius, and what is sqrt(144)?")
    print(answer)`,
    explanation:
      "ReAct (Yao et al., 2022) interleaves reasoning and acting. Unlike structured tool use where the API handles parsing, ReAct uses free-text output with conventions (`Thought:`, `Action:`, `Observation:`). The model reasons about what to do, takes an action, sees the observation, and continues until it reaches `Final Answer:`. The scratchpad accumulates the full reasoning trace and is injected into the next prompt, giving the model its 'memory' of what it has already tried. This pattern predates native API tool use and is still useful when you want explicit reasoning traces for debugging or when working with models that don't support structured tool calls.",
    testCases: `# Test action parsing
name, kwargs = parse_action('get_weather(location="Tokyo", unit="celsius")')
assert name == "get_weather"
assert kwargs["location"] == "Tokyo"
assert kwargs["unit"] == "celsius"

name, kwargs = parse_action('calculate(expression="2 + 2")')
assert name == "calculate"
assert kwargs["expression"] == "2 + 2"

name, kwargs = parse_action('not_a_valid_action')
assert name is None

# Test action execution
result = execute_action('calculate(expression="10 * 10")')
assert result == "100"

result = execute_action('get_weather(location="Paris", unit="fahrenheit")')
assert "F" in result or "°" in result

result = execute_action('unknown_tool(x="1")')
assert "Unknown tool" in result

print("All ReAct tests passed.")`,
    timeComplexity: "O(iterations * prompt_length)",
    spaceComplexity: "O(scratchpad_length)",
  },

  {
    id: "agents-012",
    type: "coding",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "stretch",
    title: "Streaming Agent Responses",
    tags: ["streaming", "SSE", "tool-use", "accumulation", "anthropic"],
    question:
      "Implement an Anthropic agent loop that uses **streaming** instead of blocking API calls.\n\nWith streaming, you receive events incrementally. For tool use, you must **accumulate** the tool call as events arrive:\n- `content_block_start` with `type: 'tool_use'` signals a new tool call\n- `content_block_delta` with `type: 'input_json_delta'` gives you partial JSON\n- `content_block_stop` signals the tool call is complete\n- `message_delta` with `stop_reason: 'tool_use'` means execute tools\n\nImplement:\n1. `stream_agent_turn()` — process a stream, accumulating tool calls and collecting text\n2. The main `run_streaming_agent()` loop — same structure as the regular loop but using the stream\n\nNote: For simplicity, use `client.messages.stream()` context manager which provides higher-level events.",
    hint: "The `anthropic` Python SDK's `.stream()` context manager yields `MessageStreamEvent` objects. Use `stream.get_final_message()` to get the complete message after streaming. Alternatively, iterate events and accumulate manually. The key insight: streaming doesn't change the agent loop structure — you still check `stop_reason` and handle `tool_use`, you just get the response incrementally.",
    starterCode: `import anthropic
import json
import math

client = anthropic.Anthropic()

tools = [
    {
        "name": "calculate",
        "description": "Evaluate a math expression.",
        "input_schema": {
            "type": "object",
            "properties": {"expression": {"type": "string"}},
            "required": ["expression"],
        },
    },
]

def execute_tool(name, inputs):
    if name == "calculate":
        try:
            allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
            return str(eval(inputs["expression"], {"__builtins__": {}}, allowed))
        except Exception as e:
            return f"Error: {e}"
    return f"Unknown tool: {name}"

def run_streaming_agent(user_message, max_iterations=10):
    """
    Run the agent loop using streaming API calls.
    Prints text tokens as they arrive, then handles tool calls.
    Returns the final text response.
    """
    messages = [{"role": "user", "content": user_message}]
    system = "You are a helpful assistant with a calculator tool."

    for iteration in range(max_iterations):
        # TODO: Use client.messages.stream() context manager
        # with client.messages.stream(...) as stream:
        #     TODO: Print text as it streams
        #     TODO: Get final message
        #     TODO: Check stop_reason
        #     TODO: Handle tool_use same as non-streaming
        pass

    return "Max iterations reached."

if __name__ == "__main__":
    result = run_streaming_agent("What is 2^32 and what is the square root of 1764?")
    print("\\nFinal:", result)`,
    solution: `import anthropic
import json
import math

client = anthropic.Anthropic()

tools = [
    {
        "name": "calculate",
        "description": "Evaluate a math expression. Use for any numeric computation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "Math expression, e.g. '2**32' or 'sqrt(1764)'",
                }
            },
            "required": ["expression"],
        },
    },
]

def execute_tool(name, inputs):
    if name == "calculate":
        try:
            allowed = {k: v for k, v in math.__dict__.items() if not k.startswith("_")}
            return str(eval(inputs["expression"], {"__builtins__": {}}, allowed))
        except Exception as e:
            return f"Error: {e}"
    return f"Unknown tool: {name}"

def run_streaming_agent(user_message, max_iterations=10):
    """
    Run the agent loop using streaming API calls.
    Prints text tokens as they arrive, then handles tool calls.
    Returns the final text response.
    """
    messages = [{"role": "user", "content": user_message}]
    system = "You are a helpful assistant with a calculator tool."
    final_text = ""

    for iteration in range(max_iterations):
        print(f"[Iteration {iteration + 1}] ", end="", flush=True)

        # Use the streaming context manager
        with client.messages.stream(
            model="claude-opus-4-5",
            max_tokens=4096,
            system=system,
            messages=messages,
            tools=tools,
        ) as stream:
            # Stream text tokens as they arrive
            for text_chunk in stream.text_stream:
                print(text_chunk, end="", flush=True)

            # Get the complete message after streaming finishes
            final_message = stream.get_final_message()

        print()  # newline after streaming

        stop_reason = final_message.stop_reason

        if stop_reason == "end_turn":
            # Extract text from the final message
            for block in final_message.content:
                if block.type == "text":
                    final_text = block.text
            return final_text

        if stop_reason == "tool_use":
            # Append the complete assistant message (same as non-streaming)
            messages.append({"role": "assistant", "content": final_message.content})

            # Execute all tool calls
            tool_results = []
            for block in final_message.content:
                if block.type == "tool_use":
                    print(f"  [Tool] {block.name}({block.input})")
                    result = execute_tool(block.name, block.input)
                    print(f"  [Result] {result}")
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached."

if __name__ == "__main__":
    result = run_streaming_agent("What is 2**32 and what is sqrt(1764)?")
    print("\\nFinal answer:", result)`,
    explanation:
      "Streaming doesn't fundamentally change the agent loop — `stop_reason` and tool call handling are identical. The difference is in how you receive the response: instead of waiting for the complete message, you get tokens as they arrive. The Anthropic SDK's `.stream()` context manager simplifies this: `stream.text_stream` yields text chunks for immediate display, and `stream.get_final_message()` returns the complete assembled message after streaming ends. For tool calls, you still use the final message's `content` blocks — the streaming was only for the text display. The user-facing benefit: responses feel faster because text appears immediately rather than after the full model computation.",
    testCases: `# Test tool execution (doesn't require API)
result = execute_tool("calculate", {"expression": "2**32"})
assert result == "4294967296", f"Got {result}"

result = execute_tool("calculate", {"expression": "sqrt(1764)"})
assert result == "42.0", f"Got {result}"

result = execute_tool("unknown", {})
assert "Unknown tool" in result

# Test math operations
result = execute_tool("calculate", {"expression": "100 ** 0.5"})
assert result == "10.0"

print("All streaming agent tests passed (API call skipped in unit test).")`,
    timeComplexity: "O(iterations * tokens)",
    spaceComplexity: "O(message_history)",
  },

  // ─── Knowledge Questions (2) ─────────────────────────────────────────

  {
    id: "agents-010",
    type: "knowledge",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "core",
    title: "Anthropic vs OpenAI API Differences",
    tags: ["anthropic", "openai", "api-comparison", "stop_reason", "finish_reason"],
    question:
      "Which of the following correctly describes the key differences between the Anthropic and OpenAI APIs when implementing a tool-use agent loop?",
    format: "multiple-choice",
    options: [
      {
        id: "A",
        text: "Anthropic uses `stop_reason == 'tool_use'` and content blocks; tool results go in a `user` message. OpenAI uses `finish_reason == 'tool_calls'` and a `tool_calls` array; results go in `role: 'tool'` messages. OpenAI's `function.arguments` is a JSON string, not a dict.",
      },
      {
        id: "B",
        text: "Both APIs use `finish_reason` to signal tool calls. Anthropic returns tool calls as a `tool_calls` array. OpenAI returns them as content blocks. Both expect tool results in a `user` message.",
      },
      {
        id: "C",
        text: "Anthropic uses `finish_reason == 'tool_use'` and OpenAI uses `stop_reason == 'tool_calls'`. Both use the same message format for tool results. The only difference is the key name for the tool definition schema (`input_schema` vs `parameters`).",
      },
      {
        id: "D",
        text: "Anthropic uses `stop_reason == 'tool_calls'` to signal tool use. OpenAI uses `finish_reason == 'tool_use'`. Both APIs parse tool arguments as Python dicts directly from the response. System messages are handled identically.",
      },
    ],
    correctAnswer: "A",
    explanation:
      "The five key API differences to memorize:\n\n1. **Stop signal:** Anthropic `stop_reason == 'tool_use'` | OpenAI `finish_reason == 'tool_calls'`\n2. **Tool call location:** Anthropic returns `tool_use` blocks inside `response.content` (a list) | OpenAI returns `choice.message.tool_calls` (a list on the message object)\n3. **Arguments format:** Anthropic `block.input` is already a Python dict | OpenAI `tool_call.function.arguments` is a **JSON string** — you must call `json.loads()` on it\n4. **Tool result format:** Anthropic tool results go in a `user` message as `{type: 'tool_result', tool_use_id: ..., content: ...}` blocks | OpenAI results go in separate `{role: 'tool', tool_call_id: ..., content: ...}` messages\n5. **System message:** Anthropic takes `system` as a top-level parameter | OpenAI passes system as `{role: 'system', content: ...}` in the messages array\n6. **Tool definition key:** Anthropic uses `input_schema` | OpenAI uses `parameters`",
  },

  {
    id: "agents-014",
    type: "knowledge",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "standard",
    title: "MCP (Model Context Protocol) Basics",
    tags: ["MCP", "model-context-protocol", "interoperability", "JSON-RPC", "servers"],
    question:
      "Explain what MCP (Model Context Protocol) is, how it works architecturally, and why it matters for agent interoperability.",
    format: "short-answer",
    options: null,
    correctAnswer:
      "MCP is an open protocol by Anthropic that standardizes how AI models connect to external tools, data sources, and services. Architecture: MCP servers expose capabilities (tools, resources, prompts) via JSON-RPC over stdio or HTTP/SSE transport. MCP clients (AI applications, IDEs, agent frameworks) connect to these servers and discover available tools. The model then uses standard tool-calling to invoke MCP tools — it doesn't know or care that they're served via MCP. Why it matters: before MCP, every tool integration was bespoke (custom code per tool per LLM). MCP creates a universal adapter — write an MCP server once and any MCP-compatible client can use it. This enables an ecosystem of reusable tool servers (GitHub, databases, APIs) that work across Claude, any LLM SDK, and IDE integrations like Claude Code.",
    explanation:
      "**MCP Architecture:**\n- **Servers** expose three types of capabilities: **Tools** (callable functions, like API endpoints), **Resources** (readable data like files or DB records), **Prompts** (reusable prompt templates)\n- **Transport:** Communication uses JSON-RPC 2.0 over stdio (local processes) or HTTP with Server-Sent Events (remote servers)\n- **Discovery:** Clients call `tools/list` to get available tools, then `tools/call` to invoke them — identical to how Anthropic's tool use works at the protocol level\n- **Clients:** Any application that speaks MCP — Claude desktop, Claude Code, LangChain, LlamaIndex, VS Code extensions\n\n**Why it matters:**\n- **Portability:** Write a Slack MCP server once; use it with any LLM client\n- **Ecosystem:** Growing library of pre-built servers for GitHub, PostgreSQL, Stripe, Google Drive, etc.\n- **Separation of concerns:** Tool authors don't need to know about the LLM; LLM clients don't need to know tool implementation details\n- **Security:** MCP servers run as separate processes with their own permissions/credentials\n\n**Practical example:** Claude Code uses MCP to connect to tool servers — the same mechanism that lets you add custom tools to your PAI.",
  },

  // ─── Open-Ended Questions (2) ────────────────────────────────────────

  {
    id: "agents-013",
    type: "open-ended",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "stretch",
    title: "Multi-Agent Handoff Pattern",
    tags: ["multi-agent", "orchestration", "router", "specialist-agents", "handoff"],
    question:
      "Design a **router agent** system that: (1) analyzes an incoming user task, (2) delegates to specialist agents (coder, researcher, writer), and (3) synthesizes their results into a final response. Describe the architecture, message passing, how to handle failures, and the trade-offs of this approach versus a single monolithic agent.",
    context:
      "Multi-agent systems are increasingly common for complex tasks that benefit from specialization. The router pattern is the simplest multi-agent architecture: one orchestrator that delegates to specialists. Interviewers want to see you think about coordination overhead, failure modes, context passing between agents, and when this is actually better than a single agent.",
    rubric: [
      "Describes the router agent's role: classify task type, select specialist(s), delegate with context",
      "Defines at least 3 specialist agents with clear, non-overlapping responsibilities",
      "Explains how context is passed: full task + relevant history, not just the original question",
      "Describes result synthesis: how the router combines outputs from multiple specialists",
      "Addresses failure handling: what happens when a specialist fails or returns low-quality output",
      "Honestly analyzes trade-offs: when multi-agent is better vs worse than a single agent",
    ],
    sampleAnswer:
      "**Architecture Overview:**\nA router agent receives the user's task and produces a structured plan: which specialists to invoke, in what order, and with what sub-tasks. Specialists execute independently (or in parallel where possible) and return results to the router, which synthesizes a final response.\n\n**Components:**\n\n*Router Agent* — Uses a classification prompt to categorize the task (coding, research, writing, or mixed). Produces a delegation plan as structured JSON: `[{agent: 'researcher', task: '...', context: '...'}, ...]`. Receives all specialist outputs and synthesizes them into a coherent response.\n\n*Researcher Agent* — Has access to web search, fetch, and database query tools. Returns structured findings with citations. Optimized for information retrieval and fact-checking.\n\n*Coder Agent* — Has access to code execution, file read/write, and testing tools. Returns working code with explanations. Optimized for correctness and running tests.\n\n*Writer Agent* — No external tools. Takes research + code output and produces polished prose. Optimized for clarity and tone.\n\n**Context Passing:**\nEach specialist receives: (1) the original user request for full context, (2) their specific sub-task, (3) any outputs from agents that ran before them (researcher output goes to writer). Pass as structured JSON in the system prompt, not as conversational turns.\n\n**Failure Handling:**\nIf a specialist fails or times out: (1) retry once with a simplified prompt, (2) if still failing, the router continues without that specialist's output and notes the gap in the final response, (3) for critical failures (e.g., coder fails on a coding task), escalate to the user. Implement a quality gate: router checks specialist outputs for minimum length and coherence before synthesis.\n\n**Trade-offs:**\n\n*Multi-agent is better when:* tasks are complex enough to exceed one model's context, specialists need different tool sets, parallel execution saves time, specialization meaningfully improves quality.\n\n*Single agent is better when:* tasks are short and cohesive, coordination overhead > specialization benefit, context sharing between agents is complex, debugging a single agent is much easier than debugging agent interactions.\n\n**Cost:** Multi-agent uses 3-5x more tokens than a single agent (each specialist has its own system prompt, history, and tool calls). Only worthwhile for genuinely complex, multi-domain tasks.",
    keyPoints: [
      "Router classifies the task and produces a structured delegation plan, not free-form routing",
      "Specialists have clear, non-overlapping tool access and optimization goals",
      "Context passing is explicit: original request + sub-task + prior agent outputs",
      "Results synthesis is the router's hardest job: detecting contradictions, filling gaps, maintaining coherence",
      "Failure modes: specialist failure, output quality below threshold, circular dependencies between specialists",
      "Multi-agent is 3-5x more expensive — only justified for tasks where specialization provides clear quality gains",
    ],
  },

  {
    id: "agents-015",
    type: "open-ended",
    category: "agents-tool-use",
    categoryLabel: "AI Agents & Tool Use",
    difficulty: "standard",
    title: "Agent Evaluation Framework",
    tags: ["evals", "evaluation", "metrics", "non-determinism", "benchmarking"],
    question:
      "Design an **evaluation framework** for an AI agent that uses tools. Address: (1) what metrics to measure, (2) how to create test cases with expected tool call sequences, (3) how to measure accuracy when outputs are non-deterministic, (4) how to track latency and cost, and (5) how to handle regression testing when the agent's behavior changes.",
    context:
      "Evaluating agents is fundamentally harder than evaluating classifiers or generators because agents take sequences of actions, not single outputs. The same correct answer may require different tool call sequences. Interviewers want to see a practical framework that acknowledges non-determinism and focuses on outcome-based rather than path-based evaluation.",
    rubric: [
      "Defines outcome-based metrics (task completion, answer correctness) vs path-based metrics (exact tool call sequence)",
      "Explains why exact tool call sequence matching is fragile and proposes alternatives (subset matching, semantic similarity)",
      "Describes how to create test cases: input, expected outcome, acceptable tool call patterns, completion criteria",
      "Addresses non-determinism: multiple runs, statistical thresholds, fuzzy matching for answers",
      "Includes latency and cost tracking: time-to-first-token, total tokens used, number of tool calls, wall clock time",
      "Describes regression testing strategy: snapshot testing with human review, A/B comparison between agent versions",
    ],
    sampleAnswer:
      "**Metric Categories:**\n\n*Outcome metrics (most important):* Task completion rate (did the agent answer correctly?), Answer quality score (human or LLM-as-judge on a 1-5 rubric), Hallucination rate (did the agent fabricate tool results or facts?)\n\n*Process metrics:* Number of tool calls per task (efficiency), Tool call accuracy (did the agent call the right tools?), Error recovery rate (when a tool fails, does the agent recover gracefully?)\n\n*Operational metrics:* Total tokens used, Wall clock time, API cost per task, Time-to-first-token (for streaming agents)\n\n**Test Case Structure:**\n```python\n{\n  'id': 'test_001',\n  'input': 'What is the weather in Tokyo and 15 * 23?',\n  'expected_tools_called': ['get_weather', 'calculate'],  # subset, not ordered\n  'expected_answer_contains': ['Tokyo', '345'],  # key facts that must appear\n  'completion_criteria': lambda answer: '345' in answer and 'Tokyo' in answer,\n  'max_iterations': 5,\n  'max_cost_usd': 0.10,\n}\n```\n\n**Handling Non-Determinism:**\nRun each test case 5-10 times and measure pass rate. A test 'passes' if it passes >= 80% of runs. For answer quality, use an LLM-as-judge prompt: 'Given question X and reference answer Y, score this response 1-5'. Average the judge scores across runs. For tool call sequences, use subset matching (required tools appeared) not exact matching (required tools appeared in exactly this order) — the agent may call tools in different orders on different runs.\n\n**Regression Testing Strategy:**\nOn each code change: (1) run the full eval suite, (2) compare pass rates vs the previous version baseline, (3) flag any test that dropped by > 10 percentage points, (4) for new agent versions, require human review of a random sample of 20 responses even if metrics are stable. Store eval results in a database with timestamps and version tags for trend analysis.\n\n**Cost Tracking:**\nWrap every API call to log `{model, input_tokens, output_tokens, timestamp, test_case_id}`. Compute cost using the model's token pricing. Alert if average cost per task exceeds the budget threshold. Track token usage trends — sudden increases often indicate prompt bloat or runaway loops.",
    keyPoints: [
      "Outcome-based evaluation (did the task get done correctly?) is more robust than path-based (exact tool call sequence)",
      "Test cases specify required tool subset and answer key facts, not exact outputs",
      "Non-determinism handled by running multiple times and using statistical pass thresholds",
      "LLM-as-judge provides scalable answer quality scoring when ground truth is hard to specify exactly",
      "Operational metrics (tokens, cost, latency) are as important as quality metrics in production",
      "Regression testing compares pass rate distributions between versions, not individual run results",
    ],
  },
];

export default agentsToolUse;
