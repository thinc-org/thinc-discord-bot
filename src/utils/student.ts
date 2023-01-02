import { FACULTY } from '@app/consts/faculty'

import { ordinal } from './ordinal'

export function isStudentId(studentId: string | number) {
  // If studentId is a number, change it to string
  if (typeof studentId !== 'string') studentId = studentId.toString()
  // If studentId is not string or length is not 10
  if (studentId.length !== 10) return false

  const validFacultyNumber = Object.keys(FACULTY)
  const facultyNumber = studentId.slice(8, 10)

  // If faculty number is not valid
  if (!validFacultyNumber.includes(facultyNumber)) return false

  // Otherwise,
  return true
}

export const getFacultyFromStudentId = (studentId: string) => {
  // If the input is not a studentId, throw an error
  if (!isStudentId(studentId)) {
    throw new Error('Invalid studentId')
  }

  const facultyNumber = studentId.slice(8, 10)
  return FACULTY[facultyNumber]
}

export const getGenerationFromStudentId = (studentId: string) => {
  // If the input is not a studentId, throw an error
  if (!isStudentId(studentId)) {
    throw new Error('Invalid studentId')
  }

  const generation = studentId.slice(0, 2)
  return parseInt(generation) - 55
}

export const getGenerationName = (generation: number) => {
  return `${ordinal(generation)} Gen`
}
