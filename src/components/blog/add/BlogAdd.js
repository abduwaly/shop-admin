import React from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData } from '@/action';
import { Form } from 'antd';

class BlogAdd extends React.Component {
    state = {

    };
    componentWillMount() {

    }
    componentWillReceiveProps(nextProps) {

    }

    render() {

        return (
            <div>
                <BreadcrumbCustom first="博客管理" second="发布博客" />
                <p>add blog....</p>
            </div>
        )
    }
}
const mapStateToProps = state => {

};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BlogAdd));