type LeaveCapableMotionElement = Element & {
  motionInstance?: {
    leave?: (done: () => void) => void
  }
}

export const runMotionLeave = (element: Element, done: () => void): void => {
  const motionElement = element as LeaveCapableMotionElement
  const leaveHandler = motionElement.motionInstance?.leave

  if (!leaveHandler) {
    done()
    return
  }

  leaveHandler(done)
}
