import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Table, Button, Modal } from 'antd';
import { fetchData, receiveData, showMDetails, showMEdit } from '@/action';
const confirm = Modal.confirm;


const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        // disabled: record.name === 'Disabled User',
    }),
};


class List extends React.Component {
    state = {
        dataSource: [],
        loading: false,
        actionFixed: 'false',
        tableBordered: true
    }
    componentWillMount() {
        this.handleRefresh();
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps) {
        const { resData: next = {} } = nextProps;
        console.log(next);
        if(next.isFetching){
            this.setState({
                loading: true
            });
        } else if(next.data && next.data.code === 0) {
            this.setState({
                dataSource: next.data.data || {},
                loading: false
            });
        }
    }

    handleRefresh = () => {
        const { receiveData, fetchData } = this.props;
        receiveData(null, 'resData');
        fetchData({
            funcName: 'managerList',
            stateName: 'resData'
        });
    }

    handleDetail = (record) => {
        const { showMDetails } = this.props;
        showMDetails(record.id);
    }
    
    handleEdit = (record) => {
        const { showMEdit } = this.props;
        showMEdit(record.id);
    }

    ToggleActionFixed = () => {
        if(this.state.actionFixed !== 'right'){
            this.setState({ actionFixed : 'right' })
        }else{
            this.setState({ actionFixed : 'false' })
        }
    }

    handleDelete = (record) => {
        const { handleRefresh } = this;
        confirm({
            title: '确定要删除该用户吗?',
            content: '用户名: '+ record.username + ', 手机: '+ record.phone,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                handleRefresh();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    

    render() {
        const columns = [{
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
            width: '120px'
        }, {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
            width: '60px'
        },{
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: '130px',
            render: (phone,record) => ('+'+ record.prefix + phone)
        }, {
            title: '地址',
            dataIndex: 'residence',
            key: 'residence',
            width: '120px'
        }, {
            title: 'Action',
            key: 'action',
            width: '200px',
            fixed: this.state.actionFixed,
            render: (record) => (
                <section>
                    <Button size="small" onClick={this.handleDetail.bind(this,record)} >查看</Button>
                    <Button size="small" onClick={this.handleEdit.bind(this,record)} >编辑</Button>
                    <Button size="small" type="danger" onClick={ this.handleDelete.bind(this,record) } >删除</Button>
                </section>
            )
        }];

        return (
            <div className="list-manager">
                <Button onClick={this.ToggleActionFixed} >操作固定/撤销</Button>
                <Spin spinning={this.state.loading}>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.state.dataSource}
                        scroll={{ x : true }}
                        bordered={ this.state.tableBordered }
                    />
                </Spin>
                <style>{`
                    .list-manager{
                        // width: 100%;
                    }
                `}</style>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { resData } = state.httpData;
    return { resData };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch),
    showMDetails: bindActionCreators(showMDetails, dispatch),
    showMEdit: bindActionCreators(showMEdit, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
