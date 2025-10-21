<script setup lang="ts">
import sanitizeHtml from 'sanitize-html';
import { replaceBadgePlaceholders } from '~~/utils/util';

const props = defineProps<{
  event: any
  visible: boolean
  x: number
  y: number
}>()

// Debug logging to see what we're getting
if (props.event && process.env.NODE_ENV === 'development') {
  console.log('Tooltip event data:', props.event);
  console.log('Event title:', props.event.title);
  console.log('Event extendedProps:', props.event.extendedProps);
}

// Process event data similar to EventModal with null checks
const eventTitle = props.event ? replaceBadgePlaceholders(props.event.title) : 'No title';
const eventTime = props.event && props.event.start 
  ? props.event.start.toLocaleDateString() + ' @ ' + props.event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  : 'No time specified';
const eventHost = props.event?.extendedProps?.org || 'No host specified';
const eventLocation = props.event?.extendedProps?.location || 'No location specified';
const rawDescription = props.event?.extendedProps?.description;
const eventDescription = rawDescription && rawDescription.trim() 
  ? replaceBadgePlaceholders(sanitizeHtml(rawDescription))
  : "needs to be added";

// Truncate description for preview but keep it readable
const truncatedDescription = eventDescription.length > 300 
  ? eventDescription.substring(0, 300) + '...' 
  : eventDescription;
</script>

<template>
  <div 
    v-if="visible && event" 
    class="event-tooltip"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="tooltip-content">
      <div class="tooltip-section">
        <span class="tooltip-label">Event Title:</span> 
        <span class="tooltip-title" v-html="eventTitle"></span>
      </div>
      <div class="tooltip-section">
        <span class="tooltip-label">Event Time:</span> 
        <span class="tooltip-time">{{ eventTime }}</span>
      </div>
      <div class="tooltip-section">
        <span class="tooltip-label">Event Host:</span> 
        <span class="tooltip-host">{{ eventHost }}</span>
      </div>
      <div class="tooltip-section" v-if="eventLocation">
        <span class="tooltip-label">Event Location:</span> 
        <span class="tooltip-location">{{ eventLocation }}</span>
      </div>
      <div class="tooltip-section">
        <span class="tooltip-label">Event Description:</span>
        <div class="tooltip-description" v-html="truncatedDescription"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-tooltip {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  max-width: 350px;
  max-height: 400px;
  overflow-y: auto;
}

.tooltip-content {
  background: var(--background-alt);
  border: 1px solid var(--border-outer);
  border-radius: 4px;
  padding: 12px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-family: var(--body-font);
  font-size: 12px;
  color: var(--text-normal);
}

.tooltip-section {
  margin-bottom: 8px;
}

.tooltip-label {
  font-weight: bold;
  color: var(--text-normal);
  font-size: 13px;
}

.tooltip-title {
  font-weight: bold;
  font-size: 14px;
  color: var(--text-normal);
}

.tooltip-time {
  color: var(--text-normal);
}

.tooltip-host {
  font-weight: 500;
  color: var(--text-normal);
}

.tooltip-location {
  color: var(--text-normal);
}

.tooltip-description {
  line-height: 1.4;
  max-height: 150px;
  overflow: hidden;
  color: var(--text-normal);
  margin-top: 4px;
}
</style>
