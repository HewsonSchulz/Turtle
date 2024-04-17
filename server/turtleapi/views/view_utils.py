def calc_missing_props(req_body, missing_props):
    missing = [
        prop
        for prop in missing_props
        if prop not in req_body or str(req_body[prop]).strip() == ''
    ]
    if missing:
        return f'''Missing propert{'y' if len(missing) == 1 else 'ies'}: {', '.join(missing)}'''
    return None
