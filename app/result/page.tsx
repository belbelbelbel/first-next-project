"use client";
import {useSearchParams } from 'next/navigation';
import React from 'react'

export default function () {
    const id = useSearchParams()
    // console.log(id)
  return (
    <div>page {id}</div>
  )
}
