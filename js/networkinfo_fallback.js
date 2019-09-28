var jpDateOverride = null;

$(".event-banner-container").remove();
$(".event-info-note").html("<b class='red-text'>You are currently offline. Automatic Timer might be incorrect.</b> Please carefully check the remaining time. If it is incorrect, either use Manual Input, or reconnect to the internet and refresh the page.");

var notificationInfo = {
    message: "",
    id: 0,
    allowDismiss: true
};