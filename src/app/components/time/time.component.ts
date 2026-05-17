import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-time',
  imports: [CommonModule],
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent implements OnInit,OnDestroy{

currentTime: string = '';
currentDate: string = '';
showTimeOnMobile: boolean = true;
showMobileTimeCard: boolean = false;
private timeInterval: any;


updateCurrentTime() {
    const now = new Date();
    
    this.currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    this.currentDate = now.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

toggleMobileTime() {
    this.showMobileTimeCard = !this.showMobileTimeCard;
    // Auto-hide after 5 seconds
    if (this.showMobileTimeCard) {
        setTimeout(() => {
            this.showMobileTimeCard = false;
        }, 5000);
    }
}

ngOnInit() {
    this.updateCurrentTime();
    this.timeInterval = setInterval(() => {
        this.updateCurrentTime();
    }, 1000);
}

ngOnDestroy() {
    if (this.timeInterval) {
        clearInterval(this.timeInterval);
    }
}

}
