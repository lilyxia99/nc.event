<script setup lang="ts">
import sanitizeHtml from 'sanitize-html';
import { replaceBadgePlaceholders } from '~~/utils/util';

const props = defineProps<{
  event: any
  visible: boolean
  x: number
  y: number
}>()

// Process event data similar to EventModal
const eventTitle = replaceBadgePlaceholders(props.event.title);
const eventTime = props.event.start.toLocaleDateString() + ' @ ' + 
                  props.event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
const eventHost = props.event.extendedProps.org;
const eventLocation = props.event.extendedProps.location;
const rawDescription = props.event.extendedProps.description;
const eventDescription = rawDescription && rawDescription.trim() 
  ? replaceBadgePlaceholders(sanitizeHtml(rawDescription))
  : "needs to be added";

// Truncate description for preview
const truncatedDescription = eventDescription.length > 200 
  ? eventDescription.substring(0, 200) + '...' 
  : eventDescription;
</script>

<template>
  <div 
    v-if="visible" 
    class="event-tooltip"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="tooltip-content">
      <div class="tooltip-title" v-html="eventTitle"></div>
      <div class="tooltip-time">{{ eventTime }}</div>
      <div class="tooltip-host">{{ eventHost }}</div>
      <div class="tooltip-location">{{ eventLocation }}</div>
      <div class="tooltip-description" v-html="truncatedDescription"></div>
    </div>
  </div>
</template>

<style scoped>
.event-tooltip {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
  max-width: 300px;
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

.tooltip-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 6px;
  color: var(--text-normal);
}

.tooltip-time {
  color: var(--text-faded);
  margin-bottom: 4px;
}

.tooltip-host {
  font-weight: 500;
  margin-bottom: 4px;
}

.tooltip-location {
  color: var(--text-faded);
  margin-bottom: 8px;
}

.tooltip-description {
  line-height: 1.4;
  max-height: 100px;
  overflow: hidden;
}
</style>
