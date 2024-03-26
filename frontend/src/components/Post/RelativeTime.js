import React from 'react'

const RelativeTime = ({ object_date }) => {

    function calculateTimeDifference(commentDate) {
        const now = new Date();
        const differenceInSeconds = Math.floor((now - new Date(commentDate)) / 1000);
      
        if (differenceInSeconds < 60) {
          return `just now`;
        }
      
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        if (differenceInMinutes < 60) {
          return `${differenceInMinutes} minute${differenceInMinutes !== 1 ? 's' : ''} ago`;
        }
      
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        if (differenceInHours < 24) {
          return `${differenceInHours} hour${differenceInHours !== 1 ? 's' : ''} ago`;
        }
      
        const differenceInDays = Math.floor(differenceInHours / 24);
        if (differenceInDays < 7) {
          return `${differenceInDays} day${differenceInDays !== 1 ? 's' : ''} ago`;
        }
      
        const differenceInWeeks = Math.floor(differenceInDays / 7);
        if (differenceInWeeks < 52) {
          return `${differenceInWeeks} week${differenceInWeeks !== 1 ? 's' : ''} ago`;
        }
      
        const differenceInYears = Math.floor(differenceInWeeks / 52);
        return `${differenceInYears} year${differenceInYears !== 1 ? 's' : ''} ago`;
      }
      
      if (object_date !== '-') {
        const formattedTimeDifference = calculateTimeDifference(object_date);
        return (
            <span style={{ margin: '0'}}>{formattedTimeDifference}</span>
          )
      } else {
        return (
            <span>-</span>
          )
      }
      

  
}

export default RelativeTime