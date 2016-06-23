import React from 'react';

const PropTypesMap = new Map();
for (let typeName in React.PropTypes) {
  if (!React.PropTypes.hasOwnProperty(typeName)) {
    continue
  }
  const type = React.PropTypes[typeName];
  PropTypesMap.set(type, typeName);
}

const stylesheet = {
  propTable: {
    th: {
      padding: 10
    },
    td: {
      padding: 10 
    }
  }
}

export default class PropTable extends React.Component {
  render () {
    const type = this.props.type;

    if (!type) {
      return null;
    }

    const props = {};

    if (type.propTypes) {
      for (let property in type.propTypes) {
        if (!type.propTypes.hasOwnProperty(property)) {
          continue
        }
        const typeInfo = type.propTypes[property];
        const propType = PropTypesMap.get(typeInfo) || 'other';
        const required = typeInfo.isRequired === undefined ? 'yes' : 'no';
        const defaultValue = '-';
        props[property] = {property, propType, required, defaultValue};
      }
    }

    if (type.defaultProps) {
      for (let property in type.defaultProps) {
        if (!type.defaultProps.hasOwnProperty(property)) {
          continue
        }
        const value = type.defaultProps[property];
        if (value === undefined) {
          continue;
        }
        if (!props[property]) {
          props[property] = {property};
        }
        props[property].defaultValue = value;
      }
    }

    const array = Object.values(props);
    if (!array.length) {
      return <small>No propTypes defined!</small>;
    }
    array.sort(function (a, b) {
      return a.property > b.property;
    });

    return (
      <table>
        <thead>
          <tr>
            <th style={stylesheet.propTable.th}>property</th>
            <th style={stylesheet.propTable.th}>propType</th>
            <th style={stylesheet.propTable.th}>required</th>
            <th style={stylesheet.propTable.th}>default</th>
          </tr>
        </thead>
        <tbody>
          {array.map(row => (
            <tr key={row.property}>
              <td style={stylesheet.propTable.td}>{row.property}</td>
              <td style={stylesheet.propTable.td}>{row.propType}</td>
              <td style={stylesheet.propTable.td}>{row.required}</td>
              <td style={stylesheet.propTable.td}>{row.defaultValue.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

PropTable.displayName = 'PropTable';
PropTable.propTypes = {
  type: React.PropTypes.func
};
