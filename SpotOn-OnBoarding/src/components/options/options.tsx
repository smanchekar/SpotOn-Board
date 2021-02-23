import React from "react";
import { Menu, Text, TextTypes, colors } from "../../components/index";
import { useHistory } from "react-router-dom";
import { Retailers } from "../../types/graphql-global-types";

interface OptionsProps {
    retailer: Retailers;
    removeUser: (uid: string) => void;
}

function Options({ retailer, removeUser }: OptionsProps) {
    const history = useHistory();
    return (
        <Menu>
            <Menu.Item
                key="0"
                onClick={() => {
                    console.log("in otions", retailer);
                    const { pathname } = history.location;
                    history.push({
                        pathname: pathname + "/edit/" + retailer.retailerId,
                        state: retailer,
                    });
                }}
            >
                <Text type={TextTypes.P}> Edit </Text>
            </Menu.Item>
            <Menu.Item
                key="1"
                onClick={() =>
                    removeUser(retailer.retailerId ? retailer.retailerId : "")
                }
            >
                <Text type={TextTypes.P} color={colors.hibiscus70}>
                    Remove
                </Text>
            </Menu.Item>
        </Menu>
    );
}

export default Options;
