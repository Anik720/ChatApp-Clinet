const AgoTimeCount = (time: any) => {
    const timeAgo = new Date(time);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timeAgo.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${timeAgo.getDate()}/${timeAgo.getMonth() + 1}/${timeAgo.getFullYear()}`;
    }
    if (hours > 0) {
        return `${timeAgo.getHours()}:${timeAgo.getMinutes()} ${timeAgo.getHours() > 12 ? 'PM' : 'AM'}`;
    }
    if (minutes > 0) {
        return `${minutes} min ago`;
    }
    if (seconds > 0) {
        return `${seconds} sec ago`;
    }
}
export default AgoTimeCount;

