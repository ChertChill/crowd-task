document.addEventListener("DOMContentLoaded", () => {
    
    const runningLines = document.querySelectorAll('.rl-content');

    runningLines.forEach((block) => {
        const clonedBlock = block.cloneNode(true);
        const parentSection = block.parentElement;

        parentSection.appendChild(clonedBlock);
    })

    document.querySelectorAll('.rl-content').forEach(block => {
        block.classList.add('marquee');
    });

});