function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    var prefix = " ago";

    if (interval > 1) {
        return interval + " years" + prefix;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months" + prefix;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days" + prefix;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours" + prefix;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes" + prefix;
    }
    if (interval === 1) {
        return interval + " minute" + prefix;
    }

    if (seconds <= 0) return 'Just now';
    return Math.floor(seconds) + " seconds" + prefix;
}

module.exports = timeSince;
