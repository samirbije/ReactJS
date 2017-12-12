import React from 'react';
import Autosuggest from 'react-autosuggest';

    const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Nepal&types=geocode&language=en&key=AIzaSyDE0Po4ijq_PtihlbFYO_xcNdaTKwN9FXk";
    const languages = [{"name":"Shibuya, Tokyo, Japan"},
        {"name":"Shibuya Station, Shibuya, Tokyo, Japan"},{"name":"Shibuya PARCO PART-1, Shibuya, Tokyo, Japan"}
        ,{"name":"Shibuya PARCO PART-3, Shibuya, Tokyo, Japan"}
    ];
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
    function escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function getSuggestions(value) {
        const escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp('^' + escapedValue, 'i');

        return languages.filter(language => regex.test(language.name));
    }

    function getSuggestionValue(suggestion) {
        console.log("ddd"+suggestion.name);
        return suggestion.name;
    }

    function renderSuggestion(suggestion) {
        return (
            <span>{suggestion.name}</span>
        );
    }

class Search extends React.Component{

    constructor() {
        super();
        this.state = {
            value: '',
            suggestions: []
        }
    };

    onChange  (event, { newValue, method })  {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested  ({ value })  {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    onSuggestionsClearRequested ()  {
        this.setState({
            suggestions: []
        });
    };
    onSubmit() {
        var str = document.getElementsByName("destination")[0].value;
        var res = str.replace(/ |,/g,'-');
        alert(res);
        document.getElementsByName("destination")[0].value = res;
    }

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "東京、横浜... ",
            value,
            onChange: this.onChange.bind(this)
        };
        const renderInputComponent = inputProps => (
            <div>
                <input {...inputProps}  name="destination" />
            </div>
        );

        return (
            <form action="search" method="get" >
            <div className="search-box">
                <div className="search-box-input">
                    <div className="search-box-field">
                        <label>どこ ?</label>
                        <br />
                        <Autosuggest
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
                            onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            inputProps={inputProps}
                            renderInputComponent={renderInputComponent}
                        />
                    </div>
                    <div className="search-box-field">
                        <label>いつ ?</label>
                        <br />
                        <input type="text" name="calender" placeholder="東京、横浜..."/>
                    </div>
                    <div className="search-box-field">
                        <label>何人 ?</label>
                        <br />
                        <select name="guest">
                            <option value="1">1 人</option>
                            <option value="2">2 人</option>
                            <option value="3">3 人</option>
                            <option value="4">4 人</option>
                            <option value="5">5 人</option>
                            <option value="6">6 人</option>
                            <option value="7">7 人</option>
                            <option value="8">8 人</option>
                            <option value="9">9 人</option>
                            <option value="10">10 人</option>
                        </select>
                    </div>
                </div>
                <button onClick={this.onSubmit.bind(this)} >探す <i className="fa fa-search" aria-hidden="true"></i></button>
            </div>
            </form>
        );
    }
}

export default Search;