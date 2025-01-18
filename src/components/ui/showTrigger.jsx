import React, { useEffect } from 'react'

function ShowTrigger() {
  useEffect(() => {
    // Request notification permission with better handling
    const requestNotificationPermission = async () => {
      try {
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return;
        }

        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestNotificationPermission();

    // Modified task checking logic
    const checkTasks = () => {
      try {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const now = new Date();
        console.log('Checking tasks at:', now.toLocaleString());

        const updatedTasks = tasks.map(task => {
          // Create task datetime
          const taskDateTime = new Date(task.date);
          const taskHours = parseInt(task.time.hours);
          const taskMinutes = parseInt(task.time.minutes);
          
          // Convert 12-hour format to 24-hour format
          let hours24 = taskHours;
          if (task.time.period === 'PM' && taskHours !== 12) {
            hours24 += 12;
          } else if (task.time.period === 'AM' && taskHours === 12) {
            hours24 = 0;
          }

          taskDateTime.setHours(hours24, taskMinutes, 0, 0);

          // Check if task time has passed
          if (now > taskDateTime && !task.completed) {
            // Mark task as completed and show notification if not already notified
            if (!task.notified) {
              console.log('Triggering notification for task:', task.name);
              showNotification(task);
            }
            return { ...task, completed: true, notified: true };
          }
          return task;
        });

        // Update localStorage with completed tasks
        if (JSON.stringify(tasks) !== JSON.stringify(updatedTasks)) {
          localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        }
      } catch (error) {
        console.error('Error checking tasks:', error);
      }
    };

    // Check more frequently (every 30 seconds)
    checkTasks();
    const interval = setInterval(checkTasks, 30000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (task) => {
    try {
      if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return;
      }

      if (Notification.permission === 'granted') {
        const notification = new Notification('Task Reminder', {
          body: `${task.name}\n${task.instructions}`,
          icon: '/notification-icon.png', // Add a default icon
          requireInteraction: true, // Keep notification until user interacts
          silent: false // Enable sound
        });

        notification.onclick = () => {
          console.log('Notification clicked');
          window.focus();
          notification.close();
        };

        console.log('Notification sent successfully');
      } else {
        console.log('Notification permission not granted');
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  return null;
}

export default ShowTrigger;