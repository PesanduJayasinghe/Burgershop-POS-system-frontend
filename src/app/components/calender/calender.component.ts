import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-calender',
  imports: [CommonModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
})
export class CalendarComponent {
  @ViewChild('inputWrapper') inputWrapper!: ElementRef;
  @ViewChild('calendar') calendar!: ElementRef;

  // Date state
  selectedDate: Date = new Date();
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  
  // UI state
  isCalendarOpen: boolean = false;

  // Calendar data
  calendarDays: number[] = [];
  
  // Month names
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Week days
  weekDays: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  constructor() {
    this.generateCalendar();
  }

  // Generate calendar days for current month
  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    const startingDay = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();
    
    this.calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push(0);
    }
    
    // Add days of the month
    for (let i = 1; i <= totalDays; i++) {
      this.calendarDays.push(i);
    }
  }

  // Toggle calendar visibility
  toggleCalendar(): void {
    this.isCalendarOpen = !this.isCalendarOpen;
    if (this.isCalendarOpen) {
      this.generateCalendar();
    }
  }

  // Previous month
  previousMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  // Next month
  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  // Select a date
  selectDate(day: number): void {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.isCalendarOpen = false;
  }

  // Check if day is today
  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() && 
           this.currentMonth === today.getMonth() && 
           this.currentYear === today.getFullYear();
  }

  // Select today's date
  selectToday(): void {
    const today = new Date();
    this.selectedDate = today;
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateCalendar();
    this.isCalendarOpen = false;
  }

  // Get formatted selected date
  getFormattedDate(): string {
    return this.selectedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
  }
}