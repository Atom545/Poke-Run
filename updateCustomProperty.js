export function getCustomProperty(elem, prop) {
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop)) || 0;
}
// parseFloat() take value as a string and returns the first number only. whitespaces are ignored and if no number is found then NaN is returned
// getComputedStyle() method gets properties and values of an element. It returns a CSSStyleDeclaration object.
// and getPropertyValue() method returns the value of the specified CSS property

export function setCustomProperty(elem, prop, value) {
    elem.style.setProperty(prop, value);
}

export function incrementCustomProperty(elem, prop, inc) {
    setCustomProperty(elem, prop, getCustomProperty(elem, prop) + inc)
}