let counter = 1000

export function nextTicketId() {
  counter += 1
  return `IT-2025-${String(counter).padStart(4, '0')}`
}

export function nextMessageId() {
  counter += 1
  return `msg-${counter}`
}

export function nextNoteId() {
  counter += 1
  return `note-${counter}`
}

export function nextKbId() {
  counter += 1
  return `kb-${counter}`
}
