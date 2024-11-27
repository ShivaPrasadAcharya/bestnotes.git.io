const utils = {
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatContent: (content) => {
        // Format tables
        content = content.replace(/\|(.+)\|/g, (match) => {
            const cells = match.split('|').filter(cell => cell.trim());
            return `<table class="table table-bordered">
                <tr>${cells.map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>
            </table>`;
        });

        
        // Format bullets
        content = content.replace(/•\s(.+)/g, '<li>$1</li>');
        content = content.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        // Format basic formatting
        content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\_\_(.+?)\_\_/g, '<u>$1</u>');
        content = content.replace(/\*(.+?)\*/g, '<em>$1</em>');

        return content;
    },

    generateId: () => {
        return Math.max(...notesData.map(note => note.id), 0) + 1;
    },

    getCurrentDate: () => {
        return new Date().toISOString().split('T')[0];
    }
};
