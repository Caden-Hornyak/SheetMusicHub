
export const opacity_animation = (object, action, duration, easing) => {
    object.animate(
        [{opacity: `${action === 'start' ? '0' : '1'}`}, { opacity: `${action === 'start' ? '1' : '0'}`}],
        {duration: duration, fill: 'forwards', easing: easing}
    )
}

export const top_animation = (object, s_top, e_top, duration, easing) => {
    object.animate(
        [{top: s_top}, { top: e_top}],
        {duration: duration, fill: 'forwards', easing: easing}
    )
}

export const attribute_animation = (object, attribute, start, end, duration, easing) => {
    object.animate(
        [{[attribute]: start}, { [attribute]: end}],
        {duration: duration, fill: 'forwards', easing: easing}
    )
}