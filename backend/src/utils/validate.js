const isValidDate = (v) => {
  if (!v) return false
  const d = new Date(v)
  return !Number.isNaN(d.getTime())
}

const validateExpense = (payload, options = { requireAll: true }) => {
  const errors = []
  const { amount, date, category } = payload || {}

  if (options.requireAll && (amount === undefined || amount === null)) {
    errors.push('Amount is required')
  }

  if (amount !== undefined && amount !== null) {
    const n = Number(amount)
    if (Number.isNaN(n)) errors.push('Amount must be a number')
    else if (n < 0) errors.push('Amount must be >= 0')
  }

  if (options.requireAll && !date) {
    errors.push('Date is required')
  }

  if (date && !isValidDate(date)) {
    errors.push('Date must be a valid ISO date')
  }

  if (category && typeof category !== 'string') {
    errors.push('Category must be a string')
  }

  return { valid: errors.length === 0, errors }
}

const validateTask = (payload, options = { requireAll: true }) => {
  const errors = []
  const { name, deadline, priority } = payload || {}

  if (options.requireAll && !name) {
    errors.push('Name is required')
  }
  if (name && typeof name !== 'string') {
    errors.push('Name must be a string')
  }

  if (options.requireAll && !deadline) {
    errors.push('Deadline is required')
  }
  if (deadline && !isValidDate(deadline)) {
    errors.push('Deadline must be a valid ISO date')
  }

  if (priority && !['low', 'medium', 'high'].includes(String(priority))) {
    errors.push('Priority must be one of: low, medium, high')
  }

  return { valid: errors.length === 0, errors }
}

module.exports = {
  validateExpense,
  validateTask,
}
