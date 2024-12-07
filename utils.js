const utils = {
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatContent: (content) => {
    let formattedContent = content;
       // Headers
    formattedContent = formattedContent.replace(/^(#{1,6})\s(.+)$/gm, (match, hashes, text) => {
        const level = hashes.length;
        return `<h${level}>${text.trim()}</h${level}>`;
    });
    
    // Bold, Italic, Underline
    formattedContent = formattedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formattedContent = formattedContent.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formattedContent = formattedContent.replace(/\_\_(.+?)\_\_/g, '<u>$1</u>');
    
// Lists with CSS styling
formattedContent = formattedContent.replace(/^\s*[-*•]\s(.+)$/gm, '<li style="margin:0;padding:1px">$1</li>');
formattedContent = formattedContent.replace(/^\d+\.\s(.+)$/gm, '<li style="margin:0;padding:1px">$1</li>');
formattedContent = formattedContent.replace(/(<li.*<\/li>)/gs, '<ul style="margin:0;padding-left:20px">$1</ul>');
    
    // Tables
    formattedContent = formattedContent.replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(cell => cell.trim());
        return `<table class="table table-bordered">
            <tr>${cells.map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>
        </table>`;
    });
    
    // Code blocks
    formattedContent = formattedContent.replace(/```(\w+)?\n([\s\S]+?)```/g, 
        (match, language, code) => `<pre><code class="language-${language || 'plaintext'}">${code.trim()}</code></pre>`);
    formattedContent = formattedContent.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    return formattedContent;
},

  
    generateId: () => {
        return Math.max(...notesData.map(note => note.id), 0) + 1;
    },

    getCurrentDate: () => {
        return new Date().toISOString().split('T')[0];
    }
};
