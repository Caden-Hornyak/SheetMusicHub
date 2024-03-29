import Cookies from 'js-cookie'
import axios from '../configs/axiosConfig.js'

export const attribute_animation = (object, attribute, start, end, duration, easing) => {
    return object.animate(
        [{[attribute]: start}, { [attribute]: end}],
        {duration: duration, fill: 'forwards', easing: easing}
    )
}

export const default_ajax = async (action, url, action_body='') => {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        },
        withCredentials: true
      }
    
      try {
        let res
        if (action == 'post') {
            const body = JSON.stringify(action_body)
            res = await axios.post(`${process.env.REACT_APP_API_URL}/api/${url}`, body, config)
        } else if (action == 'get') {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/${url}`, config)
        }
        
        if (res.data.error) {
            console.log(res.data.error)
            return -1
        } else {
            return res.data
        }
      } catch (err) {   
        console.log(err)
        return -1
      }
}

export function Timer(callback, delay) {
    var args = arguments,
        self = this,
        timer, start

    this.clear = function () {
        clearTimeout(timer)
    }

    this.pause = function () {
        this.clear()
        delay -= new Date() - start
    }

    this.resume = function () {
        start = new Date()
        timer = setTimeout(function () {
            callback.apply(self, Array.prototype.slice.call(args, 2, args.length))
        }, delay)
    }

    this.resume()
}