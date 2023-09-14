"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Input, Table, Typography } from "antd";
import { GET_COUNTRIES, client } from "./queries";

const { Search } = Input;

interface Country {
  key: any;
  code: string;
  name: string;
  phone: string;
  native: string;
  emoji: string;
  currency: string;
  languages: {
    name: string;
  }[];
  continent: {
    name: string;
  };
}

interface Data {
  countries: Country[];
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, data } = useQuery<Data>(GET_COUNTRIES, {
    client: client,
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [previouslySelectedCountry, setPreviouslySelectedCountry] =
    useState<Country | null>(null);

  const [selectedGroupField, setSelectedGroupField] = useState<Country | null>(
    null
  );
  const [previouslySelectedGroupField, setPreviouslySelectedGroupField] =
    useState<Country | null>(null);

  useEffect(() => {
    if (!loading && data?.countries) {
      let searchFilter = "";
      let groupByField = "";
      const searchInputParts = searchTerm.split(" ");
      if (searchInputParts.length === 2) {
        const [search, group] = searchInputParts;
        if (search.startsWith("search:")) {
          searchFilter = search.substring(7); // Remove "search:" prefix
        }
        if (group.startsWith("group:")) {
          groupByField = group.substring(6); // Remove "group:" prefix
        }
      } else {
        searchFilter = searchTerm;
      }

      // Filter by search term
      if (searchFilter) {
        let filteredCountries = countries.filter((country) =>
          country.name.toLowerCase().includes(searchFilter.toLowerCase())
        );
        if (groupByField) {
          const groupedData: { [key: string]: Country[] } = {};
          filteredCountries.forEach((country: any) => {
            const groupValue = country[groupByField];
            if (!groupedData[groupValue]) {
              groupedData[groupValue] = [];
            }
            groupedData[groupValue].push(country);
            if (groupedData[groupValue].length === 1) {
              setSelectedGroupField(groupValue);
            }
          });
        }
      }
    }
  }, [loading, data, searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let countries: Country[] = data?.countries || [];

  const getRowBackgroundColor = (record: Country) => {
    if (selectedCountry === record || selectedGroupField === record.key!) {
      return "table-row-selected";
    } else if (
      previouslySelectedCountry === record ||
      previouslySelectedGroupField === record.key!
    ) {
      return "table-row-previously-selected";
    }
    return "";
  };

  // Parse search and group instructions
  let searchFilter = "";
  let groupByField = "";
  const searchInputParts = searchTerm.split(" ");
  if (searchInputParts.length === 2) {
    const [search, group] = searchInputParts;
    if (search.startsWith("search:")) {
      searchFilter = search.substring(7); // Remove "search:" prefix
    }
    if (group.startsWith("group:")) {
      groupByField = group.substring(6); // Remove "group:" prefix
    }
  } else {
    searchFilter = searchTerm;
  }

  // Filter by search term
  if (searchFilter) {
    countries = countries.filter((country) =>
      country.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }

  // Group by a field (if groupByField is specified)
  if (groupByField) {
    const groupedData: { [key: string]: Country[] } = {};
    countries.forEach((country: any) => {
      const groupValue = country[groupByField];
      if (!groupedData[groupValue]) {
        groupedData[groupValue] = [];
      }
      groupedData[groupValue].push(country);
    });

    const columns = [
      {
        title: groupByField,
        dataIndex: groupByField,
        key: groupByField,
        render: (group: any) => (
          <Typography.Title level={5}>{group}</Typography.Title>
        ),
      },
    ];

    return (
      <div>
        <Typography.Title level={4}>Countries List</Typography.Title>
        <Search
          placeholder="Search by name and/or group by field"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
        <Table
          columns={columns}
          dataSource={Object.entries(groupedData).map(([group]) => ({
            key: group,
            [groupByField]: group,
          }))}
          pagination={false}
          rowClassName={(record: any) => getRowBackgroundColor(record)}
          rowKey={(record) => record.key}
          onRow={(record: any) => ({
            onClick: (e) => {
              if (selectedCountry === record) {
                e.preventDefault();
                setSelectedGroupField(null);
                setPreviouslySelectedGroupField(null);
              } else {
                e.preventDefault();
                setSelectedGroupField(record[groupByField]);
                setPreviouslySelectedGroupField(selectedGroupField);
              }
            },
          })}
        />
      </div>
    );
  }

  // Display ungrouped data in a table
  const columns = [
    {
      title: "Country",
      dataIndex: "name",
      key: "name",
      render: (text: any, record: any) => <a href="/">{text}</a>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Continent",
      render: (record: any) => record.continent.name,
      key: "continent",
    },
    {
      title: "phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "native",
      dataIndex: "native",
      key: "native",
    },
    {
      title: "emoji",
      dataIndex: "emoji",
      key: "emoji",
    },
    {
      title: "currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "languages",
      render: (record: any) =>
        record.languages.map((l: any) => l.name).join(", "),
      key: "languages",
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Countries List</Typography.Title>
      <Search
        placeholder="Search by name and/or group by field"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <Table
        columns={columns}
        dataSource={countries}
        pagination={false}
        onRow={(record: any) => ({
          onClick: (e) => {
            if (selectedCountry === record) {
              e.preventDefault();
              setSelectedCountry(null);
              setPreviouslySelectedCountry(null);
            } else {
              e.preventDefault();
              setSelectedCountry(record);
              setPreviouslySelectedCountry(selectedCountry);
            }
          },
        })}
        rowKey={(record) => record.code}
        rowClassName={(record) => getRowBackgroundColor(record)}
      />
    </div>
  );
}
