import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchData, receiveData, hideMEdit } from '@/action';
import { Modal, Spin, Input, Form, Tooltip, Icon, Cascader, Select, AutoComplete } from 'antd';
import { residences } from '../../../constants/residences';


const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const emailSuffix = ['qq.com', 'gmail.com', '163.com'];

class EditModal extends React.Component {

    state = {
        loading: false,
        dataSource: {},
        confirmDirty: false,
        autoCompleteResult: [],
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { fetchData } = this.props;
                console.log('Received values of form: ', values);
                fetchData({funcName: 'editManager', params: values, stateName: 'editResponse'});
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    checkPhone = (rule, value, callback) => {
        // const form = this.props.form;
        if(value && !(/^1[34578]\d{9}$/.test(value)) ){
            callback('手机号码有误!');
        }
        callback();
    }

    handleMailChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else if(value.indexOf('@') < 0){
            autoCompleteResult = emailSuffix.map(domain => `${value}@${domain}`);
        } else if((value.charAt(value.length-1) === '@') && value.indexOf('@') === value.lastIndexOf('@')) {
            autoCompleteResult = emailSuffix.map(domain => `${value}${domain}`);
        } else {
            autoCompleteResult = [];
        }
        this.setState({ autoCompleteResult });
    }

    handleChange = (v) => {
        console.log(v);
    }

    handleOk = (e) => {
        this.handleSubmit(e);
        this.props.hideMEdit();
        this.props.receiveData(null, 'response');
    }

    handleCancel = (e) => {
        this.props.hideMEdit();
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };

        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 80 }}>
                <Option value="86">+86</Option>
            </Select>
        );

        const emailOptions = autoCompleteResult.map(email => (
            <AutoCompleteOption key={email}>{email}</AutoCompleteOption>
        ));

        const { dataSource } = this.state;

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
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label={(
                            <span>
                              用户名&nbsp;
                              <Tooltip title="What do you want other to call you?">
                                <Icon type="question-circle-o" />
                              </Tooltip>
                            </span>
                          )}
                            hasFeedback
                        >
                            {getFieldDecorator('username', {
                                initialValue: dataSource.username || '',
                                rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机号码"
                            hasFeedback
                        >
                            {getFieldDecorator('phone', {
                                initialValue: dataSource.phone,
                                rules: [{
                                    required: true, message: '请输入手机号码!' },
                                    {
                                        validator: this.checkPhone,
                                    }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色"
                        >
                            {getFieldDecorator('role', {
                                initialValue: dataSource.role,
                                rules: [{ required: true, message: 'Please select a role!' }],
                            })(
                                <Select placeholder="select a role" onChange={this.handleChange}>
                                    <Option value="管理员">管理员</Option>
                                    <Option value="店铺">店铺</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="地址"
                        >
                            {getFieldDecorator('residence', {
                                initialValue: dataSource.residence,
                                rules: [{ type: 'array', required: true, message: '请选择地址!' }],
                            })(
                                <Cascader options={residences} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="E-mail"
                            hasFeedback
                        >
                            {getFieldDecorator('email', {
                                initialValue: dataSource.email || '',
                                rules: [{
                                    type: 'email', message: 'The input is not valid E-mail!',
                                }],
                            })(
                                <AutoComplete
                                    dataSource={emailOptions}
                                    onChange={this.handleMailChange}
                                    placeholder="Email"
                                >
                                    <Input />
                                </AutoComplete>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    const { response, editResponse } = state.httpData;
    const { visible, editId } = state.editInfo;
    return { response, visible, editId, editResponse };
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch),
    hideMEdit: bindActionCreators(hideMEdit, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditModal));
