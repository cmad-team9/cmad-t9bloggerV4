var Loader = require('halogen/PulseLoader');
var Example = React.createClass({
  render: function() {
    return (
      <Loader color="#26A65B" size="16px" margin="4px"/>
    );
  }
});

class Spinner extends React.Component {
	render() {
   return (
      <Loader color="#26A65B" size="16px" margin="4px"/>
    );
  }
}