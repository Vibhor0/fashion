midway.controller('mainController', function ($scope) {
    $scope.oneAtATime = true;
    $scope.groups = [
        {
            title: 'Tshirts',
            contents: ['printed', 'plain', 'striped']
    },
        {
            title: 'Shirts',
            contents: ['Formal', 'Casual', 'Slim fit']
    },
        {
            title: 'Jeans',
            contents: ['Skinny', 'Slim', 'Regular']
    },
        {
            title: 'Shoes',
            contents: ['printed', 'plain', 'striped']
    }
  ];

});