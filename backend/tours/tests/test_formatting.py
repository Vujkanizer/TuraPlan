from decimal import Decimal

from tours.services import characters, format_number, format_pallets, pluralize

FORMS = ["naročilo", "naročili", "naročila", "naročil"]


def test_format_number_uses_slovenian_separators():
    assert format_number(1200) == "1.200"
    assert format_number(Decimal("1.5")) == "1,5"


def test_pluralize_picks_the_form_for_one_two_and_five():
    assert pluralize(1, FORMS) == "1 naročilo"
    assert pluralize(2, FORMS) == "2 naročili"
    assert pluralize(5, FORMS) == "5 naročil"


def test_pluralize_uses_the_many_form_from_five_up():
    assert pluralize(11, FORMS) == "11 naročil"


def test_format_pallets_uses_the_accusative():
    assert format_pallets(1) == "1 paleto"
    assert format_pallets(2) == "2 paleti"
    assert format_pallets(4) == "4 palete"
    assert format_pallets(5) == "5 palet"


def test_format_pallets_uses_palete_for_a_fraction():
    assert format_pallets(Decimal("1.5")) == "1,5 palete"


def test_characters_declines_znak():
    assert characters(1) == "1 znak"
    assert characters(2) == "2 znaka"
    assert characters(5) == "5 znakov"
