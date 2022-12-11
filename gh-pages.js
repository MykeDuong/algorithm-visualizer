import ghpages from 'gh-pages'

ghpages.publish(
  'docs', // path to public directory
  {
    branch: 'gh-pages',
    repo: 'https://github.com/MykeDuong/algorithm-visualizer.git', // Update to point to your repository
    user: {
      name: 'MykeDuong', // update to use your name
      email: 'hongminh4402@gmail.com' // Update to use your email
    },
    dotfiles: true
  },
  () => {
    console.log('Deploy Complete!');
  }
);