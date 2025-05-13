export const scheduleData = {
  regularSchedules: [
    {
      id: "REG-001",
      dayOfWeek: "monday",
      timeSlots: [
        { start: "08:00", end: "12:00" },
        { start: "13:00", end: "17:00" }
      ],
      active: true,
      createdAt: "2024-03-01T09:00:00Z",
      updatedAt: "2024-03-01T09:00:00Z"
    },
    {
      id: "REG-002",
      dayOfWeek: "tuesday",
      timeSlots: [
        { start: "09:00", end: "12:30" },
        { start: "14:00", end: "18:00" }
      ],
      active: true,
      createdAt: "2024-03-01T09:00:00Z",
      updatedAt: "2024-03-01T09:00:00Z"
    }
  ],
  scheduleOverrides: [
    {
      id: "OVR-001",
      date: "2025-05-05",
      type: "modified",
      timeSlots: [ 
        { start: "10:00", end: "12:00" },
        { start: "14:30", end: "16:00" }
      ],
      status: "active",
      createdAt: "2025-05-15T10:00:00Z",
      updatedAt: "2025-05-15T10:00:00Z"
    },
    {
      id: "OVR-002",
      date: "2024-03-20",
      type: "modified",
      timeSlots: [
        { start: "10:00", end: "12:00" },
        { start: "14:30", end: "16:00" }
      ],
      status: "active",
      createdAt: "2024-03-01T10:00:00Z",
      updatedAt: "2024-03-01T10:00:00Z"
    }
  ]
};