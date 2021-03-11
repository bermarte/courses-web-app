const COURSES_SCHEMA = {
    "title": "User Courses Input",
    "description": "Definition of input to create new course",
    "type": "object",
    "properties": {
        "id": {
            "type": "number"
        },
        "name": {
            "type": "string"
        },
        "place": {
            "type": "string"
        },
        "details": {
            "type": "string"
        }
    },
    "required": [
        "id",
        "name",
        "details"
    ]
}

module.exports = COURSES_SCHEMA