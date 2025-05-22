let currentClassName = '';

function showAttendeeForm() {
    currentClassName = document.getElementById('className').value.trim();
    if (!currentClassName) {
        alert('Please enter a class name');
        return;
    }

    // Show class name and attendee form
    document.getElementById('classNameSection').style.display = 'none';
    document.getElementById('displayClassName').style.display = 'block';
    document.getElementById('currentClassName').textContent = `Current Class: ${currentClassName}`;
    document.getElementById('checkInForm').style.display = 'block';
}

function saveToCSV(data) {
    // Get current date and time for the filename
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    // Create CSV content
    const headers = ['Date', 'Time', 'Class Name', 'Full Name', 'Company Name', 'Email', 'Phone', 'Interested in Future Classes'];
    const csvContent = [
        headers.join(','),
        [
            now.toLocaleDateString(),
            now.toLocaleTimeString(),
            data.className,
            data.fullName,
            data.companyName,
            data.email,
            data.phone || 'N/A',
            data.futureInterest ? 'Yes' : 'No'
        ].join(',')
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const filename = `class-checkin_${currentClassName}_${date}_${time}.csv`;
    
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkInForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            className: currentClassName,
            fullName: document.getElementById('fullName').value,
            companyName: document.getElementById('companyName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            futureInterest: document.getElementById('futureInterest').checked
        };

        // Save the data
        saveToCSV(formData);

        // Reset the form and show success message
        this.reset();
        alert('Check-in successful! The data has been saved to a CSV file.');
    });
});
