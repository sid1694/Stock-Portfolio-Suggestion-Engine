import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "./Login.css";
import axios from "axios";
import * as Cookies from "js-cookie";

class Login extends Component {
  state = {
    error: false,
    result: null,
    error_message: "",
  };

  onFinish = (values) => {
    console.log(values);
    let strategies = [...values["strategy"]];
    console.log(strategies);

    let payload = {
      amount_to_be_invested: values.amount,
      selected_strategies: strategies,
    };
    axios
      .post("/invest_amount", payload)
      .then((res) => {
        console.log(res.data);
        if ("error" in res.data) {
          console.log(res.data.error);
          this.setState({
            error: true,
            error_message: res.data.error,
            result: null,
          });
        } else {
          this.setState({ result: res.data, error: false, error_message: "" });
        }
      })
      .catch((err) => {
        console.log("inside");
        console.log(err.response.data);
        this.setState({ error: true });
      });
  };

  render() {
    let errorCheck = null;
    if (this.state.error) {
      errorCheck = <h4 style={{ color: "red" }}>{this.state.error_message}</h4>;
    }
    let result_info = null;
    if (this.state.result) {
      let data = [];
      for (let key in this.state.result.history) {
        data.push({
          name: key,
          amount: this.state.result.history[key],
        });
      }

      let investment = null;

      investment = this.state.result.invested_stocks.map((stock) => {
        return (
          <Row style={{ border: "1px solid" }}>
            <Col style={{ border: "1px solid" }} span={8}>
              {stock.name}
            </Col>
            <Col style={{ border: "1px solid" }} span={8}>
              {stock.amount}
            </Col>
            <Col style={{ border: "1px solid" }} span={8}>
              {stock.no_of_units}
            </Col>
          </Row>
        );
      });
      result_info = (
        <Row>
          <Col span={12}>
            <LineChart
              width={700}
              height={550}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </Col>
          <Col span={12}>
            <Row style={{ border: "1px solid" }}>
              <Col span={8}></Col>
              <Col span={8}>
                <h4>Portfolio</h4>
              </Col>
              <Col span={8}></Col>
            </Row>
            <Row style={{ border: "1px solid" }}>
              <Col span={12}>Amount invested :</Col>
              <Col span={12}>{this.state.result.invested_amount}</Col>
            </Row>
            <br></br>
            <hr></hr>
            <br></br>

            <Row style={{ border: "1px solid" }}>
              <Col style={{ border: "1px solid" }} span={8}>
                Stock Name
              </Col>
              <Col style={{ border: "1px solid" }} span={8}>
                Invested amount
              </Col>
              <Col style={{ border: "1px solid" }} span={8}>
                Number of units
              </Col>
            </Row>
            {investment}
          </Col>
        </Row>
      );
    }
    return (
      <div id="bg1">
        <Row gutter={16}>
          <Col span={8}></Col>
          <Col span={8}>
            <Card
              title="Strategy"
              style={{ width: 300 }}
              headStyle={{
                fontWeight: "bold",
                color: "blue",
                fontSize: "40px",
                fontStyle: "italic",
                fontFamily: "Lucida Console, Courier, monospace",
              }}
              bordered={true}
              size={"default"}
              style={{
                border: "1px double",
                width: "100%",
                height: "70%",
                backgroundColor: "RGB(195, 200, 201)",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "30%",
              }}
            >
              <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={this.onFinish}
              >
                <Form.Item
                  name={["amount"]}
                  label="Amount to be invested"
                  rules={[{ type: "number", min: 0 }]}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item name="strategy" label="Select Strategy">
                  <Checkbox.Group>
                    <Row>
                      <Checkbox value="ethical" style={{ lineHeight: "32px" }}>
                        Ethical Investing
                      </Checkbox>
                    </Row>

                    <Row>
                      <Checkbox value="growth" style={{ lineHeight: "32px" }}>
                        Growth Investing
                      </Checkbox>
                    </Row>

                    <Row>
                      <Checkbox value="index" style={{ lineHeight: "32px" }}>
                        Index Investing
                      </Checkbox>
                    </Row>

                    <Row>
                      <Checkbox value="quality" style={{ lineHeight: "32px" }}>
                        Quality Investing
                      </Checkbox>
                    </Row>

                    <Row>
                      <Checkbox value="value" style={{ lineHeight: "32px" }}>
                        Value Investing
                      </Checkbox>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                {errorCheck}

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={8}></Col>
        </Row>
        {result_info}
      </div>
    );
  }
}

export default Login;
