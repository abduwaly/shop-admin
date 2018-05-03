import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData, hideMDetails, showMEdit } from '@/action';
import { Modal, Spin, Button } from 'antd';

class DetailsModal extends React.Component {

    state = {
        loading: false,
        dataSource: {}
    }

    componentWillReceiveProps(nextProps) {
        const { detailsId: nextId, visible: nextV, response: nextRes = {} } = nextProps;
        if( nextV && nextId !== this.props.detailsId){
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

    handleGotIt = (e) => {
        this.props.hideMDetails();
        this.props.receiveData(null, 'response');
    }

    handleToEdit = (e) => {
        this.props.hideMDetails();
        this.props.showMEdit(this.props.detailsId);
    }

    render () {
        return (
            <Modal
                title="用户信息"
                className="manager-details-modal"
                visible={this.props.visible}
                onCancel={this.handleGotIt}
                footer={[
                    <Button key="back" onClick={this.handleToEdit}>Edit</Button>,
                    <Button key="submit" type="primary" onClick={this.handleGotIt}>
                      OK
                    </Button>,
                 ]}
            >
                <Spin spinning={this.state.loading}>
                    <p>{ this.state.dataSource.username }</p>
                    <p>{ this.state.dataSource.phone }</p>
                    <p>{ this.state.dataSource.role }</p>
                    <p>{ this.state.dataSource.residence }</p>
                </Spin>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    const { response } = state.httpData;
    const { visible, detailsId } = state.detailsInfo;
    return { response, visible, detailsId };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch),
    hideMDetails: bindActionCreators(hideMDetails, dispatch),
    showMEdit: bindActionCreators(showMEdit, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsModal);
