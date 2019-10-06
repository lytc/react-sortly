export default function isTouchDevice() {
  return 'ontouchstart' in window 
  || !!navigator.maxTouchPoints 
  || !!navigator.msMaxTouchPoints;
}
