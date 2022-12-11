import ghpages from 'gh-pages';

ghpages.publish(
    'src/app.html', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/MykeDuong/algorithm-visualizer.git',
        user: {
            name: 'MykeDuong',
            email: 'hongminh4402@gmail.com'
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)
