import pytest
from src.agents.intent_analyzer import analyze_intent


def test_analyze_intent_add_task():
    """Test intent detection for adding tasks"""
    result = analyze_intent("Add task: Buy groceries", [])
    assert result["intent"] == "add_task"
    assert result["parameters"]["title"] == "Buy groceries"


def test_analyze_intent_list_tasks():
    """Test intent detection for listing tasks"""
    result = analyze_intent("Show my tasks", [])
    assert result["intent"] == "list_tasks"


def test_analyze_intent_complete_task():
    """Test intent detection for completing tasks"""
    result = analyze_intent("Complete task #1", [])
    assert result["intent"] == "complete_task"
    assert result["parameters"]["task_id"] == 1


def test_analyze_intent_update_task():
    """Test intent detection for updating tasks"""
    result = analyze_intent("Update task #1 to 'Buy vegetables'", [])
    assert result["intent"] == "update_task"
    assert result["parameters"]["task_id"] == 1
    assert result["parameters"]["title"] == "Buy vegetables"


def test_analyze_intent_delete_task():
    """Test intent detection for deleting tasks"""
    result = analyze_intent("Delete task #2", [])
    assert result["intent"] == "delete_task"
    assert result["parameters"]["task_id"] == 2


def test_analyze_intent_greeting():
    """Test intent detection for greetings"""
    result = analyze_intent("Hello there", [])
    assert result["intent"] == "greeting"


def test_analyze_intent_help_request():
    """Test intent detection for help requests"""
    result = analyze_intent("Help me", [])
    assert result["intent"] == "help_request"


def test_extract_parameters_from_message():
    """Test parameter extraction from message"""
    result = analyze_intent("Update task #1 to 'Buy organic vegetables and fruits'", [])
    assert result["parameters"]["task_id"] == 1
    assert result["parameters"]["title"] == "Buy organic vegetables and fruits"


def test_extract_parameters_without_task_id():
    """Test parameter extraction when no task ID is mentioned"""
    result = analyze_intent("Add task: Call the plumber", [])
    assert result["parameters"]["title"] == "Call the plumber"
    assert "task_id" not in result["parameters"]


def test_analyze_intent_other():
    """Test intent detection for other/unrecognized intents"""
    result = analyze_intent("What's the weather like?", [])
    assert result["intent"] == "other"
