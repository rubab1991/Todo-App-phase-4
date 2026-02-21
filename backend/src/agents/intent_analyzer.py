import re
from typing import Dict, Any, List, Optional


# Keyword patterns for intent classification
INTENT_PATTERNS = {
    "add_task": [
        r'\b(add|create|new|make|remember|remind)\b.*\b(task|todo|item)\b',
        r'\b(add|create|new|make)\b\s+',
        r'\bremember\s+to\b',
        r'\bremind\s+me\b',
        r'\bneed\s+to\b.*\b(remember|do|finish|complete|pay|buy|call|send|write|clean|fix)\b',
    ],
    "list_tasks": [
        r'\b(show|list|view|display|get|see)\b.*\b(task|todo|item|all)\b',
        r'\bwhat\b.*\b(task|todo|pending|completed|done)\b',
        r'\bmy\s+tasks\b',
        r'\bpending\b',
        r'\bwhat\s+have\s+i\s+(completed|done|finished)\b',
        r'\bwhat\'?s\s+pending\b',
        r'\bcompleted\s+tasks?\b',
    ],
    "update_task": [
        r'\b(update|change|rename|modify|edit)\b.*\b(task|todo|item)\b',
        r'\b(update|change|rename|modify|edit)\b\s+task\s+',
        r'\bchange\s+task\s+',
    ],
    "complete_task": [
        r'\b(complete|finish|done|mark)\b.*\b(task|todo|item)\b',
        r'\bdone\s+with\b',
        r'\bfinish\b',
        r'\bmark.*complete\b',
        r'\bmark\s+task\s+#?\d+',
    ],
    "delete_task": [
        r'\b(delete|remove|cancel|drop)\b.*\b(task|todo|item)\b',
        r'\b(delete|remove|cancel)\b\s+task\s+',
    ],
    "greeting": [
        r'^(hi|hello|hey|howdy|greetings|good\s+(morning|afternoon|evening)|yo|sup)\b',
    ],
    "help_request": [
        r'\b(help|how\s+do\s+i|how\s+to|what\s+can\s+you|instructions|guide)\b',
    ],
    "identity": [
        r'\bwho\s+am\s+i\b',
        r'\bwhat\s+is\s+my\s+(name|email)\b',
        r'\bwho\s+are\s+you\b',
        r'\bwhat\s+are\s+you\b',
        r'\bmy\s+(name|email|account|profile)\b',
    ],
}


def analyze_intent(message: str, conversation_history: Optional[List[Dict]] = None) -> Dict[str, Any]:
    """
    Analyze user intent from natural language message using keyword pattern matching.
    """
    msg_lower = message.lower().strip()

    predicted_intent = "other"
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, msg_lower):
                predicted_intent = intent
                break
        if predicted_intent != "other":
            break

    # Extract parameters based on intent
    params = extract_parameters(message, predicted_intent)

    return {
        "intent": predicted_intent,
        "parameters": params,
        "original_message": message
    }


def extract_parameters(message: str, intent: str) -> Dict[str, Any]:
    """
    Extract parameters from the message based on the intent
    """
    params = {}

    # Extract task_id if present in the message
    task_id_match = re.search(r'task\s+#?(\d+)', message, re.IGNORECASE)
    if task_id_match:
        params['task_id'] = int(task_id_match.group(1))

    # Also check for standalone "#N" or "number N"
    if 'task_id' not in params:
        standalone_id = re.search(r'#(\d+)', message)
        if standalone_id:
            params['task_id'] = int(standalone_id.group(1))

    # Extract title for add/update tasks
    if intent == 'add_task':
        title = _extract_add_title(message)
        if title:
            params['title'] = title

    elif intent == 'update_task':
        title = _extract_update_title(message)
        if title:
            params['title'] = title

    # Extract status filter for list_tasks
    if intent == 'list_tasks':
        msg_lower = message.lower()
        if any(word in msg_lower for word in ['pending', "what's pending", 'not done', 'incomplete']):
            params['status'] = 'pending'
        elif any(word in msg_lower for word in ['completed', 'done', 'finished']):
            params['status'] = 'completed'
        else:
            params['status'] = 'all'

    if intent == 'complete_task':
        params['status'] = 'completed'

    # Extract description if present after title
    if intent in ['add_task', 'update_task'] and params.get('title'):
        title_pos = message.find(params['title'])
        if title_pos != -1:
            after_title = message[title_pos + len(params['title']):].strip()
            if after_title and len(after_title) < 100:
                params['description'] = after_title

    return params


def _extract_add_title(message: str) -> str:
    """Extract task title from an add_task message."""
    msg = message.strip()

    # Pattern: "add task: Buy groceries" or "add task Buy groceries"
    match = re.search(r'(?:add|create|make|new)\s+(?:a\s+)?task[:\s]+(.+?)(?:\.|$)', msg, re.IGNORECASE)
    if match:
        title = match.group(1).strip()
        # Remove leading "to " if present: "add task to buy groceries" → "buy groceries"
        title = re.sub(r'^to\s+', '', title, flags=re.IGNORECASE)
        title = re.sub(r'[.:,;!?]+$', '', title)
        if title:
            return title

    # Pattern: "remember to pay bills" or "remind me to call mom"
    match = re.search(r'(?:remember|remind\s+me)\s+to\s+(.+?)(?:\.|$)', msg, re.IGNORECASE)
    if match:
        title = match.group(1).strip()
        title = re.sub(r'[.:,;!?]+$', '', title)
        if title:
            return title

    # Pattern: "I need to remember to pay bills"
    match = re.search(r'need\s+to\s+(?:remember\s+to\s+)?(.+?)(?:\.|$)', msg, re.IGNORECASE)
    if match:
        title = match.group(1).strip()
        title = re.sub(r'[.:,;!?]+$', '', title)
        if title:
            return title

    # Fallback: strip the command verb and use the rest
    clean_msg = re.sub(r'^(add|create|remember|make|new)\s+', '', msg, flags=re.IGNORECASE)
    clean_msg = re.sub(r'^(a\s+)?task\s*[:\s]*', '', clean_msg, flags=re.IGNORECASE)
    clean_msg = re.sub(r'^to\s+', '', clean_msg, flags=re.IGNORECASE)
    clean_msg = re.sub(r'[.:,;!?]+$', '', clean_msg)
    if clean_msg:
        return clean_msg

    return ""


def _extract_update_title(message: str) -> str:
    """Extract new title from an update_task message."""
    # Pattern: "change task 1 to 'Call mom tonight'" or "update task 1 to Call mom"
    match = re.search(
        r'(?:update|change|rename|modify|edit)\s+task\s+#?\d+\s+(?:to|as)\s+[\'"]?(.+?)[\'"]?\s*$',
        message, re.IGNORECASE
    )
    if match:
        title = match.group(1).strip()
        title = re.sub(r'[.:,;!?]+$', '', title)
        if title:
            return title

    return ""
