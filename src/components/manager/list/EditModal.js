import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData, hideMEdit } from '@/action';
import { Modal, Spin, Input } from 'antd';

class EditModal extends React.Component {

    state = {
        loading: false,
        dataSource: {}
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        const { editId: nextId, visible: nextV, response: nextRes = {} } = nextProps;
        if( nextV && nextId !== this.props.editId){
            const { fetchData } = this.props;
            fetchData({funcName: 'getManagerById', params: nextId, stateName: 'response'});
        }
        if(nextRes.isFetching){
            this.setState({
                loading: true
            });
        } else if(nextRes.data && nextRes.data.code === 0) {
            this.setState({
                dataSource: nextRes.data.data,
                loading: false
            });
        }

    }

    handleOk = (e) => {
        this.props.hideMEdit();
        this.props.receiveData(null, 'response');
    }

    handleCancel = (e) => {
        this.props.hideMEdit();
    }

    render () {
        return (
            <Modal
                title="修改用户信息"
                className="manager-edit-modal"
                visible={this.props.visible}
                okText="提交"
                cancelText="取消编辑"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Spin spinning={this.state.loading}>
                    <Input defaultValue={ this.state.dataSource.username } />
                    <Input defaultValue={ this.state.dataSource.phone } />
                    <Input defaultValue={ this.state.dataSource.role } />
                    <Input defaultValue={ this.state.dataSource.residence } />
                </Spin>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    const { response } = state.httpData;
    const { visible, editId } = state.editInfo;
    return { response, visible, editId };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch),
    hideMEdit: bindActionCreators(hideMEdit, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
