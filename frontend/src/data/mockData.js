import dayjs from 'dayjs'

export const ticketStatuses = [
  'Open',
  'In Progress',
  'Pending',
  'Resolved',
  'Closed',
  'Canceled',
]

export const ticketPriorities = ['Low', 'Normal', 'High', 'Critical']

export const mockUsers = [
  {
    id: 'u-001',
    name: 'น้องเมย์',
    email: 'may@example.com',
    role: 'user',
    department: 'การตลาด',
  },
  {
    id: 'u-002',
    name: 'พี่วิน',
    email: 'win.it@example.com',
    role: 'admin',
    department: 'IT Support',
  },
  {
    id: 'u-003',
    name: 'คุณใหญ่',
    email: 'yai.manager@example.com',
    role: 'manager',
    department: 'IT Management',
  },
]

export const mockKnowledgeBase = [
  {
    id: 'kb-001',
    title: 'วิธีแก้ปัญหา Wi-Fi ต่อไม่ได้',
    category: 'Network',
    content:
      '1. ตรวจสอบว่าเปิด Wi-Fi แล้ว 2. ลองปิดเปิด Router 3. หากยังไม่ได้ ติดต่อ IT Support',
    keywords: ['wifi', 'อินเทอร์เน็ต', 'network'],
    helpfulCount: 42,
    createdAt: dayjs().subtract(45, 'day').toISOString(),
    updatedAt: dayjs().subtract(12, 'day').toISOString(),
    status: 'Published',
    authorId: 'u-002',
  },
  {
    id: 'kb-002',
    title: 'การติดตั้งโปรแกรม Microsoft Office',
    category: 'Software',
    content:
      'ดาวน์โหลดจากพอร์ทัล Microsoft 365 เลือก Install Office จากนั้นทำตามขั้นตอนบนหน้าจอ',
    keywords: ['office', 'word', 'excel'],
    helpfulCount: 28,
    createdAt: dayjs().subtract(60, 'day').toISOString(),
    updatedAt: dayjs().subtract(5, 'day').toISOString(),
    status: 'Published',
    authorId: 'u-002',
  },
]

export const mockTickets = [
  {
    id: 'IT-2025-0001',
    subject: 'คอมพิวเตอร์เปิดไม่ติด',
    description:
      'เมื่อเช้ากดเปิดแล้วไฟติดแป๊บเดียวดับ ต้องรีบใช้พรีเซนต์งานช่วงบ่าย',
    category: 'Hardware',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    updatedAt: dayjs().subtract(1, 'day').toISOString(),
    status: 'In Progress',
    priority: 'High',
    attachments: [],
    requesterId: 'u-001',
    assigneeId: 'u-002',
    messages: [
      {
        id: 'msg-001',
        authorId: 'u-001',
        authorRole: 'user',
        type: 'public',
        body: 'รบกวนช่วยดูด่วนค่ะ ต้องใช้ทำพรีเซนต์งานวันนี้',
        createdAt: dayjs().subtract(2, 'day').toISOString(),
      },
      {
        id: 'msg-002',
        authorId: 'u-002',
        authorRole: 'admin',
        type: 'public',
        body: 'เช็คเบื้องต้นแล้ว คาดว่าเป็นเพราะ PSU เดี๋ยวเปลี่ยนให้ช่วงเที่ยงครับ',
        createdAt: dayjs().subtract(1, 'day').toISOString(),
      },
    ],
    internalNotes: [
      {
        id: 'note-001',
        authorId: 'u-002',
        authorRole: 'admin',
        body: 'เตรียม PSU เบอร์ 450W ไว้แล้ว ควรทดสอบก่อนส่งคืน',
        createdAt: dayjs().subtract(1, 'day').toISOString(),
      },
    ],
    statusHistory: [
      {
        status: 'Open',
        changedBy: 'u-002',
        changedAt: dayjs().subtract(2, 'day').toISOString(),
      },
      {
        status: 'In Progress',
        changedBy: 'u-002',
        changedAt: dayjs().subtract(1, 'day').toISOString(),
      },
    ],
    closeDueAt: dayjs().add(1, 'day').toISOString(),
  },
  {
    id: 'IT-2025-0002',
    subject: 'ขอสิทธิ์เข้าระบบบัญชี',
    description:
      'เพิ่งย้ายมาทีมการตลาด ต้องใช้ระบบบัญชีเพื่อดูรายงาน ROI ของแคมเปญ',
    category: 'Access',
    createdAt: dayjs().subtract(7, 'day').toISOString(),
    updatedAt: dayjs().subtract(2, 'day').toISOString(),
    status: 'Resolved',
    priority: 'Normal',
    attachments: [],
    requesterId: 'u-001',
    assigneeId: 'u-002',
    messages: [
      {
        id: 'msg-003',
        authorId: 'u-001',
        authorRole: 'user',
        type: 'public',
        body: 'ต้องใช้ด่วนสำหรับรีพอร์ตอาทิตย์หน้า ขอบคุณค่ะ',
        createdAt: dayjs().subtract(7, 'day').toISOString(),
      },
      {
        id: 'msg-004',
        authorId: 'u-002',
        authorRole: 'admin',
        type: 'public',
        body: 'เพิ่มสิทธิ์เรียบร้อยแล้ว ลอง login อีกครั้งนะครับ',
        createdAt: dayjs().subtract(2, 'day').toISOString(),
      },
    ],
    internalNotes: [],
    statusHistory: [
      {
        status: 'Open',
        changedBy: 'u-002',
        changedAt: dayjs().subtract(7, 'day').toISOString(),
      },
      {
        status: 'In Progress',
        changedBy: 'u-002',
        changedAt: dayjs().subtract(6, 'day').toISOString(),
      },
      {
        status: 'Resolved',
        changedBy: 'u-002',
        changedAt: dayjs().subtract(2, 'day').toISOString(),
      },
    ],
    closeDueAt: dayjs().add(1, 'day').toISOString(),
  },
]

export const mockMetrics = {
  adoptionRate: 0.92,
  averageResolutionHours: 14,
  csatScore: 4.6,
  ticketVolume: [
    { month: 'Jan', total: 28, resolved: 26 },
    { month: 'Feb', total: 36, resolved: 33 },
    { month: 'Mar', total: 39, resolved: 35 },
  ],
  popularCategories: [
    { category: 'Hardware', count: 18 },
    { category: 'Software', count: 22 },
    { category: 'Access', count: 14 },
  ],
}
