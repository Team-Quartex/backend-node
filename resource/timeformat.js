export function formatPostTime(postTime) {
    const postDate = new Date(postTime); // Parse the provided date string
    const now = new Date(); // Get the current date and time
    const timeDiff = now - postDate; // Difference in milliseconds
    const seconds = Math.floor(timeDiff / 1000); // Difference in seconds
    const minutes = Math.floor(seconds / 60); // Difference in minutes
    const hours = Math.floor(minutes / 60); // Difference in hours
    const days = Math.floor(hours / 24); // Difference in days
    const weeks = Math.floor(days / 7); // Difference in weeks

    if(seconds<60){
      return `${seconds} seconds ago`
    }
    else if(minutes<60){
      return `${minutes} minutes ago`
    }
    else if (hours < 24) {
        // If within the past two days, show hours
        return `${hours} hours ago`;
    } else if (days <= 7) {
        // If within the past week, show days
        return `${days} days ago`;
    } else {
        // Show month and day
        const options = { month: 'long', day: 'numeric' }; // E.g., "November 15"
        return postDate.toLocaleDateString(undefined, options);
    }
}


export function formatDate(dateString,type) {
    const date = new Date(dateString);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format the result
    if(type === 'dateonly'){
      return `${year}-${month}-${day}`
    }else{
      return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
    }
}