import { createContext, useContext, useMemo, useReducer } from 'react'
import dayjs from 'dayjs'
import {
  mockKnowledgeBase,
  mockMetrics,
  mockTickets,
  ticketStatuses,
} from '../data/mockData'
import {
  nextKbId,
  nextMessageId,
  nextNoteId,
  nextTicketId,
} from '../utils/id'

const DataContext = createContext(null)

const initialState = {
  tickets: mockTickets,
  knowledgeBase: mockKnowledgeBase,
  notifications: [],
  metrics: mockMetrics,
}

function upsertStatusHistory(ticket, status, userId) {
  const historyEntry = {
    status,
    changedBy: userId,
    changedAt: dayjs().toISOString(),
  }
  return [...(ticket.statusHistory ?? []), historyEntry]
}

function dataReducer(state, action) {
  switch (action.type) {
    case 'CREATE_TICKET': {
      const { ticket } = action.payload
      return {
        ...state,
        tickets: [ticket, ...state.tickets],
        notifications: [
          {
            id: `nt-${Date.now()}`,
            type: 'email',
            message: `ส่งอีเมลแจ้งเตือน Ticket ใหม่ให้ ${ticket.requesterId} และทีม IT`,
            createdAt: dayjs().toISOString(),
            ticketId: ticket.id,
          },
          ...state.notifications,
        ],
      }
    }
    case 'ADD_MESSAGE': {
      const { ticketId, message } = action.payload
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                messages: [...ticket.messages, message],
                updatedAt: message.createdAt,
              }
            : ticket,
        ),
        notifications: [
          {
            id: `nt-${Date.now()}`,
            type: 'email',
            message: `ส่งอีเมลแจ้งเตือนการตอบกลับ Ticket ${ticketId}`,
            createdAt: dayjs().toISOString(),
            ticketId,
          },
          ...state.notifications,
        ],
      }
    }
    case 'ADD_INTERNAL_NOTE': {
      const { ticketId, note } = action.payload
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                internalNotes: [...ticket.internalNotes, note],
                updatedAt: note.createdAt,
              }
            : ticket,
        ),
      }
    }
    case 'ASSIGN_TICKET': {
      const { ticketId, assigneeId, changedBy } = action.payload
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                assigneeId,
                updatedAt: dayjs().toISOString(),
                statusHistory: [
                  ...(ticket.statusHistory ?? []),
                  {
                    status: ticket.status,
                    changedBy,
                    changedAt: dayjs().toISOString(),
                    note: `Assign to ${assigneeId}`,
                  },
                ],
              }
            : ticket,
        ),
        notifications: [
          {
            id: `nt-${Date.now()}`,
            type: 'email',
            message: `ส่งอีเมลแจ้งเตือนการมอบหมาย Ticket ${ticketId} ให้ ${assigneeId}`,
            createdAt: dayjs().toISOString(),
            ticketId,
          },
          ...state.notifications,
        ],
      }
    }
    case 'CHANGE_STATUS': {
      const { ticketId, status, changedBy, priority, autoClose } =
        action.payload
      if (!ticketStatuses.includes(status)) {
        return state
      }
      return {
        ...state,
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status,
                priority: priority ?? ticket.priority,
                updatedAt: dayjs().toISOString(),
                statusHistory: upsertStatusHistory(ticket, status, changedBy),
                closeDueAt:
                  status === 'Resolved'
                    ? dayjs().add(3, 'day').toISOString()
                    : ticket.closeDueAt,
              }
            : ticket,
        ),
        notifications:
          status === 'Resolved' || status === 'Closed' || autoClose
            ? [
                {
                  id: `nt-${Date.now()}`,
                  type: 'email',
                  message: `แจ้งเตือนสถานะ Ticket ${ticketId} เปลี่ยนเป็น ${status}`,
                  createdAt: dayjs().toISOString(),
                  ticketId,
                },
                ...state.notifications,
              ]
            : state.notifications,
      }
    }
    case 'UPSERT_KB': {
      const { article } = action.payload
      const exists = state.knowledgeBase.some((item) => item.id === article.id)
      return {
        ...state,
        knowledgeBase: exists
          ? state.knowledgeBase.map((item) =>
              item.id === article.id ? article : item,
            )
          : [article, ...state.knowledgeBase],
      }
    }
    case 'DELETE_KB': {
      const { id } = action.payload
      return {
        ...state,
        knowledgeBase: state.knowledgeBase.filter((item) => item.id !== id),
      }
    }
    case 'RECORD_NOTIFICATION': {
      return {
        ...state,
        notifications: [action.payload.notification, ...state.notifications],
      }
    }
    default:
      return state
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState)

  const createTicket = ({
    subject,
    description,
    category,
    attachments,
    requesterId,
    priority,
  }) => {
    const now = dayjs().toISOString()
    const id = nextTicketId()
    const ticket = {
      id,
      subject,
      description,
      category,
      createdAt: now,
      updatedAt: now,
      status: 'Open',
      priority: priority ?? 'Normal',
      attachments: attachments ?? [],
      requesterId,
      assigneeId: null,
      messages: [],
      internalNotes: [],
      statusHistory: [
        {
          status: 'Open',
          changedBy: requesterId,
          changedAt: now,
        },
      ],
      closeDueAt: dayjs().add(3, 'day').toISOString(),
    }
    dispatch({ type: 'CREATE_TICKET', payload: { ticket } })
    return ticket
  }

  const addMessage = ({ ticketId, authorId, authorRole, body }) => {
    const message = {
      id: nextMessageId(),
      authorId,
      authorRole,
      type: 'public',
      body,
      createdAt: dayjs().toISOString(),
    }
    dispatch({ type: 'ADD_MESSAGE', payload: { ticketId, message } })
    return message
  }

  const addInternalNote = ({ ticketId, authorId, body }) => {
    const note = {
      id: nextNoteId(),
      authorId,
      authorRole: 'admin',
      body,
      createdAt: dayjs().toISOString(),
    }
    dispatch({ type: 'ADD_INTERNAL_NOTE', payload: { ticketId, note } })
    return note
  }

  const assignTicket = ({ ticketId, assigneeId, changedBy }) => {
    dispatch({
      type: 'ASSIGN_TICKET',
      payload: { ticketId, assigneeId, changedBy },
    })
  }

  const changeStatus = ({ ticketId, status, changedBy, priority, autoClose }) =>
    dispatch({
      type: 'CHANGE_STATUS',
      payload: { ticketId, status, changedBy, priority, autoClose },
    })

  const upsertKnowledgeBase = ({
    id,
    title,
    content,
    category,
    keywords,
    authorId,
    status,
  }) => {
    const now = dayjs().toISOString()
    const article = {
      id: id ?? nextKbId(),
      title,
      content,
      category,
      keywords: keywords ?? [],
      status: status ?? 'Draft',
      helpfulCount: 0,
      createdAt: id
        ? state.knowledgeBase.find((item) => item.id === id)?.createdAt ?? now
        : now,
      updatedAt: now,
      authorId,
    }
    dispatch({ type: 'UPSERT_KB', payload: { article } })
    return article
  }

  const deleteKnowledgeBase = (id) =>
    dispatch({ type: 'DELETE_KB', payload: { id } })

  const recordNotification = (message, ticketId) =>
    dispatch({
      type: 'RECORD_NOTIFICATION',
      payload: {
        notification: {
          id: `nt-${Date.now()}`,
          type: 'log',
          message,
          createdAt: dayjs().toISOString(),
          ticketId,
        },
      },
    })

  const value = useMemo(
    () => ({
      ...state,
      createTicket,
      addMessage,
      addInternalNote,
      assignTicket,
      changeStatus,
      upsertKnowledgeBase,
      deleteKnowledgeBase,
      recordNotification,
    }),
    [state],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) {
    throw new Error('useData ต้องใช้ภายใต้ DataProvider')
  }
  return ctx
}
