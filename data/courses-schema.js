const COURSES_SCHEMA = {
    "title": "User Courses Input",
    "description": "Definition of input to create new course",
    "type": "object",
    "properties": {
        "id": {
            "type": "number"
        },
        "name": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
        },
        "place": {
            "type": "string",
            "maxLength": 30
        },
        "details": {
            "type": "string",
            "minLength": 3,
            "maxLength": 30
        }
    },
    "required": [
        "id",
        "name",
        "details"
    ]
}

module.exports = COURSES_SCHEMA